import { formatPrice } from './formatterFunction';

// 적용 상품 타입 변환 (서버 -> 전역변수)
export const formatSellType = (type) => {
  const types = {
    ALL: 0, // 전체상품
    CATEGORY: 1, //카테고리
    EACH: 2, //개별상품
  };
  return types[type];
};

// 적용 상품 타입 변환 (전역변수 -> 서버)
export const transformSellType = (type) => {
  switch (type) {
    case 1:
      return 'CATEGORY';
    case 2:
      return 'EACH';
    case 0:
    default:
      return 'ALL';
  }
};

// 정기 배송 유형 타입 변환 (서버 -> 전역변수)
export const formatSubscriptionType = (type) => {
  const types = {
    MONTH: 0,
    COUNT: 1,
  };
  if (type) {
    return types[type];
  } else {
    return null;
  }
};

// 정기 배송 유형 타입 변환 (전역변수 -> 서버)
export const transformSubscriptionType = (type) => {
  switch (type) {
    case 1:
      return 'COUNT';
    case 0:
      return 'MONTH';
    default:
      return null;
  }
};

// 서버에서 받은 dayValues를 클라이언트 형식에 맞게 변환 (서버 -> 전역변수)
export const formatDayValues = (dayValues) => {
  const dayOption = { MON: false, TUE: false, WED: false, THU: false, FRI: false };
  if (dayValues && dayValues.length !== 0) {
    dayValues.forEach((item) => {
      dayOption[item.value] = true;
    });
  }
  return dayOption;
};

// dayValues 변환 (전역변수 -> 서버)
export const transformDayValues = (dayOption) => {
  const dayValues = Object.entries(dayOption)
    .filter(([key, value]) => value)
    .map(([key, value]) => key);
  return dayValues;
};

// 서버에서 받은 weekValues를 클라이언트 형식에 맞게 변환 (서버 -> 전역변수)
export const formatWeekValues = (weekValues) => {
  const weekOption = { 1: false, 2: false, 3: false, 4: false, 5: false };
  if (weekValues && weekValues.length !== 0) {
    weekValues.forEach((item) => {
      weekOption[item.value] = true;
    });
  }
  return weekOption;
};

// weekValues 변환 (전역변수 -> 서버)
export const transformWeekValues = (dayOption) => {
  const weekValues = Object.entries(dayOption)
    .filter(([key, value]) => value)
    .map(([key, value]) => parseInt(key, 10));
  return weekValues;
};

// 선택한 category데이터를 selectCategoryOptions로 변환 (서버 -> 전역변수)
export const formatSelectCategoryOptions = (content) => {
  const selectCategoryOptions = content.map((item) => {
    return { value: item.categoryId, label: item.name };
  });
  return selectCategoryOptions;
};

// 선택한 categoryIds -> selectedCategoryOptions에 넣는 형식으로 변환 (서버 -> 전역변수)
export const formatSelectedCategoryOptions = (data, selectCategoryOptions) => {
  return selectCategoryOptions.filter((categoryOption) => data.includes(categoryOption.value));
};

// selectedCategoryOptions 형식 변환 (전역변수 -> 서버)
export const transformSelectedCategoryOptions = (selectedCategoryOptions) => {
  return selectedCategoryOptions.map((option) => parseInt(option.value, 10));
};

// product 데이터를 selectEachProductOptions로 변환 (서버 -> 전역변수)
export const formatSelectEachProductOptions = (content) => {
  const options = {
    ONETIME: [],
    SUBSCRIPTION: [],
    BOTH: [],
  };

  content.forEach((item) => {
    const newItem = selctedOptionFormat(item);
    if (item.deliveryType !== 'ONETIME') {
      options.SUBSCRIPTION.push(newItem);
      options.BOTH.push(newItem);
    } else if (item.deliveryType !== 'SUBSCRIPTION') {
      options.ONETIME.push(newItem);
      options.BOTH.push(newItem);
    }
  });

  return options;
};

const selctedOptionFormat = (item) => {
  return {
    categoryName: item.categoryName, // 카테고리 이름
    code: item.code, // 상품 코드
    cost: formatPrice(item.cost), //상품금액
    group: item.categoryName, // 상품 그룹 (= 카테고리)
    label: item.name, // 상품 명
    value: item.productId, // 상품 Id
  };
};
// // product 데이터를 selectEachProductOptions로 변환 (서버 -> 전역변수)
// export const formatSelectEachProductOptions = (content) => {
//   const selectEachProductOptions = content.map((item) => {
//     return {
//       categoryName: item.categoryName, // 카테고리 이름
//       code: item.code, // 상품 코드
//       cost: formatPrice(item.cost), //상품금액
//       group: item.categoryName, // 상품 그룹 (= 카테고리)
//       label: item.name, // 상품 명
//       value: item.productId, // 상품 Id
//     };
//   });
//   return selectEachProductOptions;
// };

// 선택한 productIds -> selectedEachProductOptions에 넣는 형식으로 변환 (서버 -> 전역변수)
export const formatSelectedEachProductOptions = (productIds, selectEachProductOptions) => {
  const newSelectedEachProductOptions = productIds.map((productId) => {
    const matchedOption = selectEachProductOptions.find((option) => option.value === productId);
    if (matchedOption) {
      return {
        label: `${matchedOption.label} (${matchedOption.code})`,
        product: matchedOption,
        value: matchedOption.value,
      };
    }
  });

  return newSelectedEachProductOptions;
};

// selectedProductOptions 형식 변환 (전역변수 -> 서버)
export const transformSelectedProductOptions = (selectedProductOptions) => {
  return selectedProductOptions.map((option) => parseInt(option.value, 10));
};

// 선택한 MonthValues를 setSelectedMonthOptions에 넣는 형식으로 변환 (서버 -> 전역변수)
export const formatSelectedMonthOptions = (data) => {
  return data.map((item) => {
    return { value: item.value, label: `${item.value}개월` };
  });
};

// 선택한 MonthValues 형식 변환 (전역변수 -> 서버)
export const tranformSelectedOptions = (selectedOptions) => {
  return selectedOptions.map((option) => parseInt(option.value, 10));
};
