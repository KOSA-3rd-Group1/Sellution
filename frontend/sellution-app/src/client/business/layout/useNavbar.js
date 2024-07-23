import { useEffect, useRef, useState } from 'react';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';

export const useNavbar = ({ logout }) => {
  const name = useUserInfoStore((state) => state.name);
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLogoutBtn = () => {
    logout();
    setIsOpen(false);
  };

  return { name, isOpen, dropdownRef, toggleDropdown, selectLogoutBtn };
};
