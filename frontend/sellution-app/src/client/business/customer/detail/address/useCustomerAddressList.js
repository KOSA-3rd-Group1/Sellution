import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { getCustomerAddressList } from '@/client/utility/apis/customer/detail/address/customerAddressListApi';
import { formatPhoneNumber } from '@/client/utility/functions/formatterFunction';

// 더미 데이터 생성 함수
// const generateDummyData = (count) => {
//   return Array.from({ length: count }, (_, index) => ({
//     id: index + 1,
//     name: `홍길동`,
//     addressName: `회사`,
//     address: '서울특별시 서초구 바우뫼로37길 30 (양재동), 1004동 1004호',
//     zipcode: `${Math.floor(10000 + Math.random() * 90000)}`,
//     phoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
//     isDefaultAddress: ['Y', 'N', 'N', 'N', 'N'][Math.floor(Math.random() * 5)],
//   }));
// };

//더미 데이터
// const DUMMY_DATA = generateDummyData(5);

export const useCustomerAddressList = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { customerId } = useParams();

  // 테이블 데이터
  const [data, setData] = useState([]);
  const defaultAddressObject = data.find((item) => item.isDefaultAddress === 'Y');

  // 데이터 총 개수
  const [totalDataCount, setTotalDataCount] = useState(0);

  const formatData = useCallback(
    (content) => ({
      ...content,
      id: content.addressId,
      phoneNumber: formatPhoneNumber(content.phoneNumber),
      address: `${content.streetAddress}, ${content.addressDetail}`,
    }),
    [],
  );

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async (customerId, setAccessToken, accessToken) => {
      const response = await getCustomerAddressList(customerId, setAccessToken, accessToken); // API 요청

      // API 받은 요청을 data에 입력
      if (response && response.data && response.data.length !== 0) {
        const formattedContent = response.data.map((item) => {
          return formatData(item);
        });
        setData(() => formattedContent);
        setTotalDataCount(formattedContent.length);
      }
    };

    fetch(customerId, setAccessToken, accessToken);
  }, []);

  return {
    data,
    totalDataCount,
    defaultAddressObject,
  };
};
