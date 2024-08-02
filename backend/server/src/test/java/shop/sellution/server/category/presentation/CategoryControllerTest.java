package shop.sellution.server.category.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
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
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
                .andExpect(jsonPath("$.content[0].name").value("Test Category"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void getCategoryById() throws Exception {
        when(categoryService.getCategoryById(1L)).thenReturn(categoryRes);

        mockMvc.perform(get("/categories/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.categoryId").value(1))
                .andExpect(jsonPath("$.name").value("Test Category"));
    }
    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void checkCategoryNameDuplicate() throws Exception {
        when(categoryService.isCategoryNameDuplicate("Test Category")).thenReturn(true);

        mockMvc.perform(get("/categories/check")
                        .param("name", "Test Category")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void createCategory() throws Exception {
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveCategoryReq))
                        .with(csrf()))
                .andExpect(status().isCreated());

        verify(categoryService, times(1)).createCategory(any(SaveCategoryReq.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void updateCategory() throws Exception {
        mockMvc.perform(put("/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveCategoryReq))
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(categoryService, times(1)).updateCategory(eq(1L), any(SaveCategoryReq.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void deleteCategory() throws Exception {
        mockMvc.perform(delete("/categories/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(categoryService, times(1)).deleteCategory(1L);
    }
}