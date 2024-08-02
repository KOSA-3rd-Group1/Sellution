// 검증 함수
export const validateInputPhoneNumber = (value) => {
  return /^[\d-]*$/.test(value);
  //   return /^\d*$/.test(value);
};

export const validateInputAccountNumber = (value) => {
  return /^[\d-]*$/.test(value);
};

// 숫자만
export const validateInputNumber = (value) => {
  return /^\d*$/.test(value);
};
