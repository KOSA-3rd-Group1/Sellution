import HomeComponent from '@/shopping/component/home/HomeComponent';
import useHome from '@/shopping/business/home/useHome.js';
import LogoHeaderNav from '../../layout/LogoHeaderNav';
import HomeFooter from '../../layout/HomeFooter';
const HomePage = () => {
  const { activeSlide, handleSlideChange } = useHome();

  return (
    <>
      <LogoHeaderNav></LogoHeaderNav>
      <HomeComponent activeSlide={activeSlide} handleSlideChange={handleSlideChange} />
      <HomeFooter></HomeFooter>
    </>
  );
};

export default HomePage;
