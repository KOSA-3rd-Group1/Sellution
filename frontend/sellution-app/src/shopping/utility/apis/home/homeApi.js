import BaseInstance from '@/shopping/utility/axios/BaseInstance';

const API_URL_1 = '/shopping-find-companyId';

//회사 정보 가져오기
export const getCompanyInfo = async (clientName, setAllCompanyData) => {
  try {
    const url = `${API_URL_1}/${clientName}`;
    let instance = await BaseInstance();
    const response = await instance.get(url);
    await setAllCompanyData(response.data.data); // zustand에 보관
    return response.data;
  } catch (error) {
    console.log('Login faild:', error);
    // window.location.href = '/shopping-404';
    return;
  }
};
