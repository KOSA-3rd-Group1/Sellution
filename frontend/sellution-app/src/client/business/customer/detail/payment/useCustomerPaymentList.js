import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { getCustomerPaymentList } from '@/client/utility/apis/customer/detail/payment/customerPaymentListApi';
import { bankCodeIndexInfo } from '@/client/utility/bank/bankInfo';

// // 더미 데이터 생성 함수
// const generateDummyData = (count) => {
//   return Array.from({ length: count }, (_, index) => ({
//     id: index + 1,
//     no: index + 100,
//     paymentMethod: `CMS`,
//     bankCode: `신한 은행`,
//     accountNumber: `${Math.floor(100000 + Math.random() * 900000)}-01-${Math.floor(100000 + Math.random() * 900000)}`,
//     createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
//       .toISOString()
//       .split('T')[0],
//   }));
// };

// //더미 데이터
// const DUMMY_DATA = generateDummyData(5);

export const useCustomerPaymentList = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId } = useParams();

  const [data, setData] = useState([]); // 테이블 데이터
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  const formatData = useCallback(
    (content, index) => ({
      ...content,
      paymentMethod: `CMS`,
      id: content.accountId,
      no: index + 1,
      createdAt: content.createdAt.split('T')[0],
      bankCode: bankCodeIndexInfo[content.bankCode].name,
    }),
    [],
  );

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async (customerId, setAccessToken, accessToken) => {
      const response = await getCustomerPaymentList(customerId, setAccessToken, accessToken); // API 요청
      const { content, empty, totalElements } = response.data;

      if (!empty) {
        const formattedContent = content.map((item, index) => {
          return formatData(item, index);
        });
        setData(() => formattedContent);
        setTotalDataCount(totalElements);
      }
    };

    fetch(customerId, setAccessToken, accessToken);
  }, []);

  return {
    data,
    totalDataCount,
  };
};
