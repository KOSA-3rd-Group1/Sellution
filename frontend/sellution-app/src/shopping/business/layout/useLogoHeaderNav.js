import { useLocation } from 'react-router-dom';

const useLogoHeaderNav = () => {
  const location = useLocation();

  const getClientName = () => {
    const pathParts = location.pathname.split('/');
    return pathParts.length > 2 ? pathParts[2] : 'defaultClient'; // defaultClient는 기본값
  };

  const clientName = getClientName();

  return { clientName };
};

export default useLogoHeaderNav;
