package xyz.cursedman.psk.ecommerce;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
class ApiSecurityTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void productsArePublic() throws Exception {
		mockMvc.perform(get("/api/products"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.products[0].name").exists());
	}

	@Test
	void checkoutOptionsArePublic() throws Exception {
		mockMvc.perform(get("/api/checkout/options"))
			.andExpect(status().isOk());
	}

	@Test
	void placingOrderRequiresToken() throws Exception {
		mockMvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content("{}"))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void placingOrderRequiresUserRole() throws Exception {
		mockMvc.perform(post("/api/orders").with(jwt())
				.contentType(MediaType.APPLICATION_JSON).content("{}"))
			.andExpect(status().isForbidden());
	}

	@Test
	void currentUserRequiresToken() throws Exception {
		mockMvc.perform(get("/api/me"))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void currentUserIsReadFromToken() throws Exception {
		mockMvc.perform(get("/api/me").with(jwt()
				.jwt(token -> token.claim("email", "user@example.com"))
				.authorities(new SimpleGrantedAuthority("ROLE_user"))))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.email").value("user@example.com"))
			.andExpect(jsonPath("$.roles.length()").value(1))
			.andExpect(jsonPath("$.roles[0]").value("user"));
	}

}
