package shop.sellution.server.category.presentation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.restdocs.request.RequestDocumentation;
import shop.sellution.server.category.application.CustomerCategoryService;
import shop.sellution.server.category.dto.response.FindCustomerCategoryRes;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.global.exception.BadRequestException;
import shop.sellution.server.global.exception.ExceptionCode;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CustomerCategoryController.class)
class CustomerCategoryControllerTest extends BaseControllerTest {
    @MockBean
    private CustomerCategoryService customerCategoryService;

    @DisplayName("사업체 Id로 isVisble이 Y인 카테고리 조회")
    @Test
    void findAllCategories_Success() throws Exception {
        // given
        Long companyId = 1L;
        List<FindCustomerCategoryRes> categories = List.of(
                new FindCustomerCategoryRes(1L, "category1"),
                new FindCustomerCategoryRes(2L, "category2")
        );

        //모킹된 service가 호출될 때 List<FindCustomerCategoryRes>을 반환
        when(customerCategoryService.findAllCategories(companyId)).thenReturn(categories);

        // when & then
        mockMvc.perform(get("/categories/company/{companyId}", companyId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryId").value(1L))
                .andExpect(jsonPath("$[0].name").value("category1"))
                .andExpect(jsonPath("$[1].categoryId").value(2L))
                .andExpect(jsonPath("$[1].name").value("category2"))
                .andDo(document("Category/findAllCategories",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("companyId").description("사업체 ID")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("[].categoryId").type(JsonFieldType.NUMBER).description("카테고리 ID"),
                                PayloadDocumentation.fieldWithPath("[].name").type(JsonFieldType.STRING).description("카테고리 이름")
                        )
                ));

    }

    @DisplayName("사업체 Id로 isVisible이 Y인 카테고리 조회 시 카테고리가 없는 경우")
    @Test
    void findAllCategories_NoCategories() throws Exception {
        // given
        Long companyId = 1L;

        //모킹된 service가 호출될 때 빈 리스트를 반환
        when(customerCategoryService.findAllCategories(companyId)).thenReturn(List.of());

        // when & then
        mockMvc.perform(get("/categories/company/{companyId}", companyId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty())
                .andDo(document("Category/findAllCategoriesNoCategories",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("companyId").description("사업체 ID")
                        ),
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("[]").description("카테고리 목록 (빈 배열)")
                        )
                ));
    }

    @DisplayName("사업체 Id로 isVisible이 Y인 카테고리 조회 시 사업체 ID가 유효하지 않은 경우")
    @Test
    void findAllCategories_InvalidCompanyId() throws Exception {
        // given
        Long companyId = 1L;

        //모킹된 service가 호출될 때 BadRequestException 발생
        when(customerCategoryService.findAllCategories(companyId)).thenThrow(new BadRequestException(ExceptionCode.NOT_FOUND_COMPANY_ID));

        // when & then
        mockMvc.perform(get("/categories/company/{companyId}", companyId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andDo(document("Category/findAllCategoriesBadRequest",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        RequestDocumentation.pathParameters(
                                parameterWithName("companyId").description("사업체 ID")
                        )
                ));
    }
}
