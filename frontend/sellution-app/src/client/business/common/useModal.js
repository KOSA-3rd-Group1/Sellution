import { useState } from 'react';

export const useModal = () => {
  const [alertModalState, setAlertModalState] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
  });

  const [autoCloseModalState, setAutoCloseModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  // AlertModal 열기
  const openAlertModal = (type, title, message) => {
    setAlertModalState({ isOpen: true, type, title, message });
  };

  // AlertModal 닫기
  const closeAlertModal = (event = null) => {
    setAlertModalState((prev) => ({ ...prev, isOpen: false }));
    if (event !== null) event;
  };

  // AutoCloseModal 열기
  const openAutoCloseModal = (title, message) => {
    setAutoCloseModalState({ isOpen: true, title, message });
  };

  // AutoCloseModal 닫기
  const closeAutoCloseModal = (event = null) => {
    setAutoCloseModalState((prev) => ({ ...prev, isOpen: false }));
    if (event !== null) event;
  };

  return {
    alertModalState,
    autoCloseModalState,
    openAlertModal,
    closeAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  };
};
