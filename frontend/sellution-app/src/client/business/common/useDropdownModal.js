import { useRef, useState } from 'react';

export const useDropdownModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

  const handleCopy = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setModalPosition({
            top: rect.bottom + window.scrollY,
            right: window.innerWidth - rect.right,
          });
        }
        setIsModalOpen(true);
        setTimeout(() => setIsModalOpen(false), 1000); // 2초 후 모달 닫기
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };
  return {
    isModalOpen,
    modalPosition,
    buttonRef,
    handleCopy,
  };
};
