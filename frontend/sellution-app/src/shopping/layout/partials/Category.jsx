const Category = ({ categoryList, onCategoryClick }) => {
  // categoryList가 존재하지 않으면 빈 배열로 설정
  const categories = categoryList || [];

  return (
    <div className='category-menu absolute top-[3.4375rem] left-0 bg-white border border-gray-200 shadow-lg z-20'>
      <span className='category-title block font-bold p-3'>카테고리</span>
      <ul className='list-none p-0'>
        {categories.map((category) => (
          <li
            key={category.categoryId}
            className='p-3 cursor-pointer text-gray-600 hover:bg-orange-100 hover:text-orange-600'
            onClick={() => onCategoryClick(category.categoryId)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
