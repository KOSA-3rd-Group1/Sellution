import { useLayoutEffect, useRef, useState } from 'react';

export const useCalendar = () => {
  // 현재 날짜
  const [currentDate, setCurrentDate] = useState(new Date());

  // 사용자가 선택한 날짜
  const [selectedDate, setSelectedDate] = useState(null);

  // 모달 위치
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  // 모달창 보이게 하는 지 여부
  const [isModalVisible, setIsModalVisible] = useState(false);

  const calendarRef = useRef(null);
  const modalRef = useRef(null);
  const selectedCellRef = useRef(null);

  // 월별 일수
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // 현재 날짜가 속한 달의 첫번째 날의 요일
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // 현재 날짜가 속한 달의 마지막 날의 요일
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDay();

  // 이전 달의 마지막 날짜
  const lastDayOfPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  ).getDate();

  const daysFromNextMonth = 6 - lastDayOfMonth;

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setIsModalVisible(false);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setIsModalVisible(false);
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 모달창 위치 계산
  const calculateModalPosition = () => {
    if (!calendarRef.current || !modalRef.current || !selectedCellRef.current) return null;

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const cellRect = selectedCellRef.current.getBoundingClientRect();
    const modalRect = modalRef.current.getBoundingClientRect();

    const cellIndex = parseInt(selectedCellRef.current.dataset.index, 10);
    const columnIndex = cellIndex % 7;
    const rowIndex = Math.floor(cellIndex / 7);
    const totalRows = Math.ceil((daysInMonth + firstDayOfMonth) / 7);
    const isLastRow = rowIndex === totalRows - 1;
    const isRightSide = columnIndex >= 4;

    let top, left;

    if (isLastRow) {
      top = cellRect.bottom - calendarRect.top - modalRect.height;
    } else {
      top = cellRect.top - calendarRect.top;
    }

    if (isRightSide) {
      left = cellRect.left - calendarRect.left - modalRect.width;
    } else {
      left = cellRect.right - calendarRect.left;
    }

    return { top, left };
  };

  //모달창 위치 변화 - 선택 날짜 및 모달 보이는지 여부 감지
  useLayoutEffect(() => {
    if (selectedDate && isModalVisible) {
      const newPosition = calculateModalPosition();
      if (newPosition) {
        setModalPosition(newPosition);
      }
    }
  }, [selectedDate, isModalVisible]);

  // 날짜 셀 외부 선택시 모달 닫는 이벤트 설정
  useLayoutEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isModalVisible &&
        !event.target.closest('.date-cell') &&
        !event.target.closest('.modal-123')
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalVisible]);

  // 모달창 닫기
  const closeModal = () => {
    setSelectedDate(null);
    setIsModalVisible(false);
  };

  // 날짜 선택 핸들러
  const handleDateClick = (day, month, event) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (month === 'prev' ? -1 : month === 'next' ? 1 : 0),
      day,
    );
    const formattedDate = formatDate(clickedDate);

    if (month === 'current') {
      // 선택한 날짜가 이번 달이라면 모달창 띄우기
      setSelectedDate(formattedDate);
      selectedCellRef.current = event.currentTarget;
      setIsModalVisible(true);
    } else if (month === 'prev') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setSelectedDate(null);
      setIsModalVisible(false);
    } else if (month === 'next') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setSelectedDate(null);
      setIsModalVisible(false);
    }
  };

  return {
    currentDate,
    selectedDate,
    modalPosition,
    isModalVisible,
    calendarRef,
    modalRef,

    daysInMonth,
    firstDayOfMonth,
    lastDayOfPrevMonth,
    daysFromNextMonth,

    prevMonth,
    nextMonth,
    formatDate,
    handleDateClick,
    closeModal,
  };
};
