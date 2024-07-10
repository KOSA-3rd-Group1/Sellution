package shop.sellution.server.account.presentation;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.restdocs.payload.JsonFieldType;
import shop.sellution.server.account.application.AccountServiceImpl;
import shop.sellution.server.account.domain.type.BankCode;
import shop.sellution.server.account.dto.response.FindAccountRes;
import shop.sellution.server.common.BaseControllerTest;
import java.time.LocalDateTime;
import java.util.List;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
class AccountControllerTest extends BaseControllerTest {

    @MockBean
    private AccountServiceImpl accountService;

    @DisplayName("고객 ID로 계좌 목록을 조회한다")
    @Test
    void findAllAccountsByCustomerId_Success() throws Exception {
        // given
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

        List<FindAccountRes> accounts = List.of(
                FindAccountRes.builder()
                        .accountId(1L)
                        .customerId(1L)
                        .bankCode(BankCode.KB.getBackCode())
                        .accountNumber("42750204039102")
                        .createdAt(LocalDateTime.now())
                        .build(),
                FindAccountRes.builder()
                        .accountId(2L)
                        .customerId(1L)
                        .bankCode(BankCode.KAKAO.getBackCode())
                        .accountNumber("42750204039103")
                        .createdAt(LocalDateTime.now())
                        .build()
        );
        Page<FindAccountRes> accountPage = new PageImpl<>(accounts, pageable, accounts.size());

        when(accountService.findAllAccountsByCustomerId(1L, pageable)).thenReturn(accountPage);

        // when & then
        mockMvc.perform(get("/accounts/customers/{customerId}", 1L)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].accountNumber").value("42750204039102"))
                .andExpect(jsonPath("$.content[1].accountNumber").value("42750204039103"))
                .andDo(document("Account/findAllByCustomerId",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("customerId").description("고객 ID")
                        ),
                        queryParameters(
                                parameterWithName("page").description("페이지 번호 (0부터 시작)").optional(),
                                parameterWithName("size").description("페이지 크기").optional()
                        ),
                        responseFields(
                                fieldWithPath("content").type(JsonFieldType.ARRAY).description("계좌 목록"),
                                fieldWithPath("content[].accountId").type(JsonFieldType.NUMBER).description("계좌 ID"),
                                fieldWithPath("content[].customerId").type(JsonFieldType.NUMBER).description("고객 ID"),
                                fieldWithPath("content[].accountNumber").type(JsonFieldType.STRING).description("계좌 번호"),
                                fieldWithPath("content[].bankCode").type(JsonFieldType.STRING).description("은행 코드"),
                                fieldWithPath("content[].createdAt").type(JsonFieldType.STRING).description("생성 일시").optional(),
                                fieldWithPath("pageable").type(JsonFieldType.OBJECT).description("페이지 정보"),
                                fieldWithPath("pageable.sort").type(JsonFieldType.OBJECT).description("정렬 정보"),
                                fieldWithPath("pageable.sort.empty").type(JsonFieldType.BOOLEAN).description("정렬 정보가 비어있는지 여부"),
                                fieldWithPath("pageable.sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("pageable.sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("pageable.pageNumber").type(JsonFieldType.NUMBER).description("페이지 번호"),
                                fieldWithPath("pageable.pageSize").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("pageable.offset").type(JsonFieldType.NUMBER).description("오프셋"),
                                fieldWithPath("pageable.paged").type(JsonFieldType.BOOLEAN).description("페이지된 여부"),
                                fieldWithPath("pageable.unpaged").type(JsonFieldType.BOOLEAN).description("페이지되지 않은 여부"),
                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("전체 페이지 수"),
                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("전체 요소 수"),
                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
                                fieldWithPath("sort").type(JsonFieldType.OBJECT).description("정렬 정보"),
                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬 정보가 비어있는지 여부"),
                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 요소 수"),
                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("결과가 비어있는지 여부")
                        )
                ));
    }
}