import { logout } from '@/shopping/utility/apis/mypage/mypageApi';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
import { useParams } from 'react-router-dom';

export const useMypage = ({ moveDefault }) => {
  const { clientName } = useParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogout = () => {
    logout(setAccessToken);
    moveDefault(`/shopping/${clientName}/home`);
  };

  return { handleLogout };
};
