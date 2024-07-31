import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { logout } from '@/client/utility/apis/layout/logoutApi';

export const useNavbar = () => {
  const navigate = useNavigate();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

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
    logout(setAccessToken);
    setIsOpen(false);
    navigate('/login');
  };

  return { isOpen, dropdownRef, toggleDropdown, selectLogoutBtn };
};
