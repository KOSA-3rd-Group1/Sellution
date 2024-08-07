package shop.sellution.server.category.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import shop.sellution.server.category.application.CategoryServiceImpl;
import shop.sellution.server.category.dto.request.SaveCategoryReq;
import shop.sellution.server.category.dto.response.FindCategoryRes;
import shop.sellution.server.common.BaseControllerTest;
import shop.sellution.server.global.type.DisplayStatus;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryController.class)
class CategoryControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryServiceImpl categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    private FindCategoryRes categoryRes;
    private SaveCategoryReq saveCategoryReq;

    @BeforeEach
    void setUp() {
        categoryRes = FindCategoryRes.builder()
                .categoryId(1L)
                .name("Test Category")
                .isVisible(DisplayStatus.Y)
                .productCount(5)
                .build();

        saveCategoryReq = SaveCategoryReq.builder()
                .name("New Category")
                .companyId(1L)
                .build();
    }

    @DisplayName("모든 카테고리를 조회한다")
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void getAllCategories() throws Exception {
        Page<FindCategoryRes> page = new PageImpl<>(List.of(categoryRes));
        when(categoryService.getAllCategories(anyLong(), any(), any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/categories")
                        .param("companyId", "1")
                        .param("isVisible", "Y")
                        .param("page", "0")
                        .param("size", "10")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].categoryId").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Test Category"))
                .andDo(result -> {
                    String content = result.getResponse().getContentAsString();
                    System.out.println("Response JSON: " + content);
                })
                .andDo(document("Category/getAllCategories",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        relaxedQueryParameters(
                                parameterWithName("companyId").description("회사 ID"),
                                parameterWithName("isVisible").description("표시 여부").optional(),
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        responseFields(
                                fieldWithPath("content[]").type(JsonFieldType.ARRAY).description("카테고리 목록"),
                                fieldWithPath("content[].categoryId").type(JsonFieldType.NUMBER).description("카테고리 ID"),
                                fieldWithPath("content[].name").type(JsonFieldType.STRING).description("카테고리 이름"),
                                fieldWithPath("content[].isVisible").type(JsonFieldType.STRING).description("표시 여부"),
                                fieldWithPath("content[].productCount").type(JsonFieldType.NUMBER).description("제품 수"),
                                fieldWithPath("pageable").type(JsonFieldType.STRING).description("페이지 정보"),
                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("전체 요소 수"),
                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("전체 페이지 수"),
                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬이 비어 있는지 여부"),
                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 요소 수"),
                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("빈 페이지 여부")
                        )
                ));
    }

    @DisplayName("카테고리 ID로 카테고리를 조회한다")
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void getCategoryById() throws Exception {
        when(categoryService.getCategoryById(1L)).thenReturn(categoryRes);

        mockMvc.perform(get("/categories/{categoryId}", 1L).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.categoryId").value(1))
                .andExpect(jsonPath("$.name").value("Test Category"))
                .andDo(document("Category/getCategoryById",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("categoryId").description("카테고리 ID")
                        ),
                        responseFields(
                                fieldWithPath("categoryId").type(JsonFieldType.NUMBER).description("카테고리 ID"),
                                fieldWithPath("name").type(JsonFieldType.STRING).description("카테고리 이름"),
                                fieldWithPath("isVisible").type(JsonFieldType.STRING).description("표시 여부"),
                                fieldWithPath("productCount").type(JsonFieldType.NUMBER).description("제품 수")
                        )
                ));
    }



    @DisplayName("카테고리 이름 중복을 확인한다")
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void checkCategoryNameDuplicate() throws Exception {
        when(categoryService.isCategoryNameDuplicate("Test Category")).thenReturn(true);

        mockMvc.perform(get("/categories/check")
                        .param("name", "Test Category")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"))
                .andDo(document("Category/checkCategoryNameDuplicate",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        relaxedQueryParameters(
                                parameterWithName("name").description("카테고리 이름")
                        )

                ));
    }



    @DisplayName("새로운 카테고리를 생성한다")
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void createCategory() throws Exception {
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveCategoryReq))
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andDo(document("Category/createCategory",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                fieldWithPath("name").type(JsonFieldType.STRING).description("카테고리 이름"),
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID")
                        )
                ));

        verify(categoryService, times(1)).createCategory(any(SaveCategoryReq.class));
    }

    @DisplayName("카테고리를 수정한다")
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void updateCategory() throws Exception {
        mockMvc.perform(put("/categories/{categoryId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveCategoryReq))
                        .with(csrf()))
                .andExpect(status().isNoContent())
                .andDo(document("Category/updateCategory",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("categoryId").description("카테고리 ID")
                        ),
                        requestFields(
                                fieldWithPath("name").type(JsonFieldType.STRING).description("카테고리 이름"),
                                fieldWithPath("companyId").type(JsonFieldType.NUMBER).description("회사 ID")
                        )
                ));

        verify(categoryService, times(1)).updateCategory(eq(1L), any(SaveCategoryReq.class));
    }

    @DisplayName("카테고리를 삭제한다")
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void deleteCategory() throws Exception {
        mockMvc.perform(delete("/categories/{categoryId}", 1L)
                        .with(csrf()))
                .andExpect(status().isNoContent())
                .andDo(document("Category/deleteCategory",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("categoryId").description("카테고리 ID")
                        )
                ));

        verify(categoryService, times(1)).deleteCategory(1L);
    }
}