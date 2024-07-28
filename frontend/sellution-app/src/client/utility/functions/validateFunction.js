// 검증 함수
export const validateInputPhoneNumber = (value) => {
  return /^[\d-]*$/.test(value);
  //   return /^\d*$/.test(value);
};

export const validateInputAccountNumber = (value) => {
  return /^[\d-]*$/.test(value);
};
