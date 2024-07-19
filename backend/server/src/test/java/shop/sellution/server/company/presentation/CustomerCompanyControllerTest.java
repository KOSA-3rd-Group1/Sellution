package shop.sellution.server.company.presentation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.restdocs.request.RequestDocumentation;
import org.springframework.security.test.context.support.WithMockUser;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.company.application.CustomerCompanyService;
import shop.sellution.server.global.exception.BadRequestException;


import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static shop.sellution.server.global.exception.ExceptionCode.NOT_FOUND_COMPANY_NAME;

@WebMvcTest(CustomerCompanyController.class)
class CustomerCompanyControllerTest extends BaseControllerTest {

    @MockBean
    private CustomerCompanyService customerCompanyService; //서비스 모킹

    @DisplayName("사업체 영어이름으로 사업체 ID를 찾는다")
    @Test
    void findCompanyIdByName_Success() throws Exception {
        // given
        String companyName = "sellutioncompany";
        Long companyId = 1L;

        //모킹된 서비스가 호출될 때 특정 값을 반환
        when(customerCompanyService.findCompanyIdByName(companyName)).thenReturn(companyId);

        // when & then
        mockMvc.perform(get("/company/{name}", companyName) //엔드포인트에 GET 요청
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) //응답 상태가 200 OK인지 검증
                .andExpect(jsonPath("$").value(companyId))  //응답 본문의 값이 예상한 사업체 ID인지 검증
                .andDo(document("Company/findCompanyIdByName",  //설정 추가
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("name").description("사업체 이름")
                        )
                ));
    }
    @DisplayName("존재하지 않는 사업체 이름으로 사업체 ID를 찾는 실패 케이스")
    @Test
    @WithMockUser // 이 어노테이션을 추가하여 인증된 사용자로 테스트합니다.
    void findCompanyIdByName_Fail() throws Exception {
        // given
        String companyName = "sellutioncompany";

        //모킹된 서비스가 호출될 때 BadRequestException을 던짐
        when(customerCompanyService.findCompanyIdByName(anyString())).thenThrow(new BadRequestException(NOT_FOUND_COMPANY_NAME));

        // when & then
        mockMvc.perform(get("/company/{name}", companyName) //엔드포인트에 GET 요청
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()) //응답 상태가 400 BAD_REQUEST인지 검증
                .andExpect(jsonPath("$.code").value(NOT_FOUND_COMPANY_NAME.getCode())) //응답 본문의 code가 예상한 code인지 검증
                .andExpect(jsonPath("$.message").value(NOT_FOUND_COMPANY_NAME.getMessage())) //응답 본문의 message가 예상한 message인지 검증
                .andDo(document("Company/findCompanyIdByNameFail",  //설정 추가
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("name").description("사업체 이름")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("code").type(JsonFieldType.NUMBER).description("에러 코드"),
                                PayloadDocumentation.fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지")
                        )
                ));

    }
}
