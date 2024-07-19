import { useEffect, useRef, useState } from 'react';

export const useBankSelector = (onSelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // 드롭다운 모달 토글
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 은행 선택시 모달 창 닫기
  const selectBank = (bank) => {
    setSelectedBank(bank);
    setIsOpen(false);
    if (onSelect) {
      onSelect('bank', bank.code);
    }
  };

  return {
    selectedBank,
    isOpen,
    dropdownRef,
    toggleDropdown,
    selectBank,
  };
};
