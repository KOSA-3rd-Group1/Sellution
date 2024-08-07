package shop.sellution.server.contractcompany.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.contractcompany.application.ContractCompanyService;
import shop.sellution.server.contractcompany.dto.request.FindContractCompanyReq;
import shop.sellution.server.contractcompany.dto.request.SaveContractCompanyReq;
import shop.sellution.server.contractcompany.dto.response.FindContractCompanyRes;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContractCompanyController.class)
class ContractCompanyControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContractCompanyService contractCompanyService;

    @DisplayName("계약 사업체를 등록한다.")
    @Test
    @WithMockUser
    void saveContractCompany_Success() throws Exception {
        // given
        SaveContractCompanyReq saveContractCompanyReq = SaveContractCompanyReq.builder()
                .contractCompanyName("Test Company")
                .businessRegistrationNumber("123-45-67890")
                .contractAuthId("testauth")
                .contractAuthPassword("Password123!")
                .build();

        when(contractCompanyService.saveContractCompany(any(SaveContractCompanyReq.class)))
                .thenReturn(1L);

        // when & then
        mockMvc.perform(post("/contract-company/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveContractCompanyReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andDo(document("ContractCompany/saveContractCompany",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("contractCompanyName").type(JsonFieldType.STRING).description("계약 사업체 이름"),
                                fieldWithPath("businessRegistrationNumber").type(JsonFieldType.STRING).description("사업자 등록 번호"),
                                fieldWithPath("contractAuthId").type(JsonFieldType.STRING).description("계약 인증 ID"),
                                fieldWithPath("contractAuthPassword").type(JsonFieldType.STRING).description("계약 인증 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("id").type(JsonFieldType.NUMBER).description("생성된 계약 사업체 ID")
                        )
                ));
    }

    @DisplayName("계약 사업체를 인증한다.")
    @WithMockUser
    @Test
    void findContractCompany_Success() throws Exception {
        // given
        FindContractCompanyReq findContractCompanyReq = new FindContractCompanyReq();
        ReflectionTestUtils.setField(findContractCompanyReq, "contractAuthId", "testauth");
        ReflectionTestUtils.setField(findContractCompanyReq, "contractAuthPassword", "Password123!");

        FindContractCompanyRes findContractCompanyRes = new FindContractCompanyRes(
                1L,
                "Test Company",
                "123-45-67890"
        );

        when(contractCompanyService.findContractCompany(any(FindContractCompanyReq.class)))
                .thenReturn(findContractCompanyRes);

        // when & then
        mockMvc.perform(post("/contract-company/authenticate")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(findContractCompanyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyId").value(1L))
                .andExpect(jsonPath("$.contractCompanyName").value("Test Company"))
                .andExpect(jsonPath("$.businessRegistrationNumber").value("123-45-67890"))
                .andDo(document("ContractCompany/findContractCompany",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("contractAuthId").type(JsonFieldType.STRING).description("계약 인증 ID"),
                                fieldWithPath("contractAuthPassword").type(JsonFieldType.STRING).description("계약 인증 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID"),
                                fieldWithPath("contractCompanyName").type(JsonFieldType.STRING).description("계약 사업체 이름"),
                                fieldWithPath("businessRegistrationNumber").type(JsonFieldType.STRING).description("사업자 등록 번호")
                        )
                ));
    }
}
