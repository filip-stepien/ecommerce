package xyz.cursedman.psk.ecommerce.config;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import xyz.cursedman.psk.ecommerce.TestcontainersConfiguration;

import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
class CurrentUserIdTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void currentUserIdIsNotDocumentedAsRequestParameter() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.paths['/api/orders'].get.parameters").doesNotExist())
			.andExpect(jsonPath("$.paths['/api/orders'].post.parameters").doesNotExist())
			.andExpect(jsonPath("$.paths['/api/orders/{id}'].get.parameters[*].name", contains("id")))
			.andExpect(jsonPath("$.paths['/api/products/recommended'].get.parameters[*].name", contains("limit")))
			.andExpect(jsonPath("$.paths['/api/assistant/chat'].post.parameters").doesNotExist());
	}

}
