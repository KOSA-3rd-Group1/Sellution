import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import useTableStore from '@/client/store/stores/useTableStore';
import { getOrderList } from '@/client/utility/apis/order/orderListApi';
import { formatPhoneNumber } from '@/client/utility/functions/formatterFunction';
import {
  formatOrderType,
  formatOrderStatus,
  formatDeliveryStatus,
  transformOrderType,
  transformOrderStatus,
  transformDeliveryStatus,
} from '@/client/utility/functions/orderListFunction';
import { HEADERS } from '@/client/utility/tableinfo/CustomerListTableInfo';
import { postApproveOrder, postAutoApproveToggle } from '../../utility/apis/order/orderListApi';

// 더미 데이터 생성 함수
// const generateDummyData = (count) => {
//   return Array.from({ length: count }, (_, index) => ({
//     id: index + 1,
//     orderId: `${Math.floor(1000 + Math.random() * 9000)}`,
//     customerId: `${Math.floor(1000 + Math.random() * 9000)}`,
//     orderCode: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
//     username: `User ${index + 1}`,
//     name: `User ${index + 1}`,
//     phoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
//     createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
//       .toISOString()
//       .split('T')[0],
//     product: `product items ... ${index + 1}`,
//     type: ['단건', '정기 (월 단위)', '정기 (횟수 단위)'][Math.floor(Math.random() * 3)],
//     status: ['주문 취소', '승인 대기', '주문 승인'][Math.floor(Math.random() * 3)],
//   }));
// };

//orderId
//customerId
// 아래는 테이블에 들어갈 것
//No
//code, 주문번호 14자리, 검색 150
//username 회원 아이디, 검색 180
//name, 회원명, 검색 150
//phoneNumber휴대폰번호, 검색 180
//createdAt, 주문등록일 130
//product, 상품 260
//type, 주문유형, [ONETIME, MONTH_SUBSCRIPTION, COUNT_SUBSCRIPTION],선택 130
//status, 주문상태, [HOLD, APPROVED, CANCEL] 130

//더미 데이터
// const DUMMY_DATA = generateDummyData(10);

export const useOrderList = ({ queryParams, page, size, refresh, updateQueryParameter }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const companyId = useUserInfoStore((state) => state.companyId);
  const { isAutoApproved, setIsAutoApproved } = useUserInfoStore((state) => ({
    isAutoApproved: state.isAutoApproved,
    setIsAutoApproved: state.setIsAutoApproved,
  }));

  const { tables, setSelectedRows, setSelectAll, clearTable } = useTableStore((state) => ({
    tables: state.tables.orderlist,
    setSelectedRows: state.setSelectedRows,
    setSelectAll: state.setSelectAll,
    clearTable: state.clearTable,
  }));

  console.log('tables', tables);

  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  // 테이블 상태 관리 - 검색, 필터, 정렬 기능
  const [tableState, setTableState] = useState(
    HEADERS.reduce((acc, header) => {
      const value = queryParams.get(header.key);
      switch (header.key) {
        case 'status':
          acc[header.key] = value ? formatOrderStatus(value) : 'All';
          break;
        case 'deliveryStatus':
          acc[header.key] = value ? formatDeliveryStatus(value) : 'All';
          break;
        default:
          acc[header.key] = value || '';
          break;
      }
      return acc;
    }, {}),
  );

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: null,
    endDate: null,
  });

  // 디바운스된 테이블 상태
  const debouncedTableState = useDebounce(tableState, 300);

  // formatData (수정 필요)
  const formatData = useCallback(
    (content, index, page, size) => ({
      id: content.orderId,
      no: index + 1 + page * size, // No.
      orderCode: content.orderCode, // 주문 번호
      customerName: content.customer.name, // 회원명
      customerPhoneNumber: formatPhoneNumber(content.customer.phoneNumber), // 휴대폰 번호
      deliveryStartDate: content.deliveryStartDate, // 주문 시작일
      deliveryEndDate: content.deliveryEndDate, // 주문 종료일
      orderedProduct:
        content.orderedProductList?.length > 1
          ? `${content.orderedProductList[0].productName} ... 외 ${content.orderedProductList?.length - 1}건`
          : `${content.orderedProductList[0].productName}`,
      type: formatOrderType(content.type),
      status: formatOrderStatus(content.status),
      deliveryStatus: formatDeliveryStatus(content.deliveryStatus),
    }),
    [],
  );

  const prepareSearchParams = (searchCondition, page, size) => {
    const filterAndTransform = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        switch (key) {
          case 'type':
            if (value) {
              const transformValue = transformOrderType(value);
              if (transformValue !== 'All') acc[key] = transformOrderType(value);
            }
            break;
          case 'status':
            if (value) {
              const transformValue = transformOrderStatus(value);
              if (transformValue !== 'All') acc[key] = transformOrderStatus(value);
            }
            break;
          case 'deliveryStatus':
            if (value) {
              const transformValue = transformDeliveryStatus(value);
              if (transformValue !== 'All') acc[key] = transformDeliveryStatus(value);
            }
            break;
          case 'orderCode':
            if (value !== null && value.trim() !== '') acc[key] = parseInt(value, 10);
            break;
          case 'customerName':
          case 'customerPhoneNumber':
            if (value !== null && value.trim() !== '') acc[key] = value;
            break;
          default:
            break;
        }
        return acc;
      }, {});
    };

    // searchCondition 객체 필터링
    const filteredCondition = filterAndTransform(searchCondition);
    if (dateRangeValue.startDate !== null) {
      filteredCondition['startDate'] = dateRangeValue.startDate;
    }

    if (dateRangeValue.endDate !== null) {
      filteredCondition['endDate'] = dateRangeValue.endDate;
    }

    // 페이징 정보 추가
    return {
      ...filteredCondition,
      page: page - 1, // 페이지는 0부터 시작하므로 1을 빼줍니다
      size: size,
    };
  };

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async (companyId, setAccessToken, accessToken) => {
      const pageParam = prepareSearchParams(tableState, page, size);
      const responseData = await getOrderList(companyId, pageParam, setAccessToken, accessToken); // API 요청

      console.log(responseData);
      const { content, empty, pageable, totalElements, totalPages } = responseData.data;

      // 필터링 시 현재 페이지에 데이터가 없는 경우 1page로 이동
      if (empty && page > 1) {
        updateQueryParameter(pageParam, 1);
      }

      if (!empty) {
        const formattedContent = content.map((item, index) => {
          return formatData(item, index, pageable.pageNumber, size);
        });
        setData(() => formattedContent);
        setTotalDataCount(totalElements);
        setTotalPages(totalPages);
        updateQueryParameter(pageParam, page);
      } else {
        setData([]);
        setTotalDataCount(0);
        setTotalPages(1);
        updateQueryParameter(pageParam, 1);
      }
    };
    fetch(companyId, setAccessToken, accessToken);

    return () => {
      clearTable('orderlist');
    };
  }, [debouncedTableState, dateRangeValue, page, refresh]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    console.log('newValue:', newDataRangeValue);
    setDateRangeValue(newDataRangeValue);
  };

  // 필터 초기화
  const handleFilterReset = (tableId) => {
    // setTableState({});

    clearTable(tableId);
  };

  // 자동 주문 승인 핸들러 - API 요청
  const handleToggleAutoOrderApproved = async () => {
    try {
      await postAutoApproveToggle(companyId, setAccessToken, accessToken);
      await setIsAutoApproved(!isAutoApproved);
      //   setIsAutoOrderApproved(!isAutoOrderApproved);
    } catch (error) {
      console.log(error);
    }
  };

  // 간편 주문 승인 이벤트 (작업해야 할 부분: 간편 주문 승인 시, 서버로 api 요청, 이후 응답 받아서 성공하면 해당 데이터 변경)
  const handleApproveAllSimpleOrderBtn = async () => {
    if (tables !== undefined) {
      Object.entries(tables.selectedRows).forEach(async ([key, value]) => {
        if (value) {
          console.log(key, value);
          await handleApproveSimpleOrder(key);
        }
      });
      alert('간편 주문 일괄 승인');
    } else {
      alert('없음');
    }
  };

  const handleApproveSimpleOrder = async (orderId) => {
    try {
      await postApproveOrder(orderId, setAccessToken, accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    data,
    totalPages,
    totalDataCount,
    tableState,
    dateRangeValue,
    isAutoApproved,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
    handleToggleAutoOrderApproved,
    handleApproveAllSimpleOrderBtn,
  };
};
