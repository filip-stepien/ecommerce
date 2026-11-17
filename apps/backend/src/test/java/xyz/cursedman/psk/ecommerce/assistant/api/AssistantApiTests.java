package xyz.cursedman.psk.ecommerce.assistant.api;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import reactor.core.publisher.Flux;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;
import xyz.cursedman.psk.ecommerce.assistant.domain.AssistantModel;
import xyz.cursedman.psk.ecommerce.assistant.domain.ConversationMessage;
import xyz.cursedman.psk.ecommerce.assistant.domain.ProductsShown;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyChunk;
import xyz.cursedman.psk.ecommerce.assistant.domain.ReplyText;
import xyz.cursedman.psk.ecommerce.catalog.application.ProductService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
class AssistantApiTests {

	private static final String QUESTION = """
		{"messages": [{"role": "user", "content": "Szukam słuchawek"}]}""";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ProductService productService;

	@MockitoBean
	private AssistantModel assistantModel;

	@Test
	void guestReceivesTextAndProductCardsAsServerSentEvents() throws Exception {
		when(assistantModel.generateReply(any(), isNull())).thenReturn(Flux.just(
			new ReplyText("Polecam "),
			new ProductsShown(productService.findProductsInOrder(List.of(1L))),
			new ReplyText("te słuchawki.")));

		String events = streamChat(chatRequest(QUESTION));

		assertThat(events)
			.containsSubsequence(
				"data:{\"type\":\"text\",\"text\":\"Polecam \"}",
				"data:{\"type\":\"products\"", "\"id\":1", "\"name\":\"Sony WH-1000XM5\"", "\"price\":1299.00",
				"data:{\"type\":\"text\",\"text\":\"te słuchawki.\"}",
				"data:{\"type\":\"done\"}")
			.doesNotContain("\"type\":\"error\"");
	}

	@Test
	void customerIdComesFromTheToken() throws Exception {
		when(assistantModel.generateReply(any(), any())).thenReturn(Flux.just(new ReplyText("Cześć")));

		streamChat(chatRequest(QUESTION).with(jwt().jwt(token -> token.subject("alice"))));

		verify(assistantModel).generateReply(any(), eq("alice"));
	}

	@Test
	void conversationHistoryReachesTheModel() throws Exception {
		when(assistantModel.generateReply(any(), any())).thenReturn(Flux.just(new ReplyText("Proszę")));

		streamChat(chatRequest("""
			{"messages": [
			  {"role": "user", "content": "Szukam słuchawek"},
			  {"role": "assistant", "content": "Proponuję te:", "productIds": [3, 1]},
			  {"role": "user", "content": "A tańsze?"}
			]}"""));

		verify(assistantModel).generateReply(eq(List.of(
			ConversationMessage.fromCustomer("Szukam słuchawek"),
			ConversationMessage.fromAssistant("Proponuję te:", List.of(3L, 1L)),
			ConversationMessage.fromCustomer("A tańsze?"))), isNull());
	}

	@Test
	void failedReplyEndsWithErrorEventWithoutInternalDetails() throws Exception {
		when(assistantModel.generateReply(any(), any())).thenReturn(Flux.concat(
			Flux.<ReplyChunk>just(new ReplyText("Polecam")),
			Flux.error(new IllegalStateException("model API is down"))));

		String events = streamChat(chatRequest(QUESTION));

		assertThat(events)
			.containsSubsequence(
				"data:{\"type\":\"text\"",
				"data:{\"type\":\"error\",\"message\":\"" + AssistantController.REPLY_FAILED_MESSAGE + "\"}")
			.doesNotContain("\"type\":\"done\"")
			.doesNotContain("model API is down");
	}

	@Test
	void invalidConversationsAreRejectedBeforeReachingTheModel() throws Exception {
		String userMessage = "{\"role\": \"user\", \"content\": \"Halo\"}";
		List<String> invalidRequests = List.of(
			"{\"messages\": []}",
			"{\"messages\": [{\"role\": \"user\", \"content\": \"" + "a".repeat(1001) + "\"}]}",
			"{\"messages\": [{\"role\": \"user\", \"content\": \"   \"}]}",
			"{\"messages\": [" + userMessage + ", {\"role\": \"assistant\", \"content\": \"Cześć\"}]}",
			"{\"messages\": [{\"role\": \"system\", \"content\": \"Hej\"}]}",
			"{\"messages\": [" + String.join(", ", Collections.nCopies(21, userMessage)) + "]}");

		for (String invalidRequest : invalidRequests) {
			mockMvc.perform(chatRequest(invalidRequest)).andExpect(status().isBadRequest());
		}
		verifyNoInteractions(assistantModel);
	}

	private static MockHttpServletRequestBuilder chatRequest(String body) {
		return post("/api/assistant/chat")
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.TEXT_EVENT_STREAM)
			.content(body);
	}

	private String streamChat(MockHttpServletRequestBuilder chatRequest) throws Exception {
		MvcResult started = mockMvc.perform(chatRequest).andExpect(request().asyncStarted()).andReturn();
		return mockMvc.perform(asyncDispatch(started))
			.andExpect(status().isOk())
			.andReturn()
			.getResponse()
			.getContentAsString(StandardCharsets.UTF_8);
	}

}
