const OneButtonFooterLayout = ({ footerText, onClick }) => {
  return (
    <nav className='fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 bg-white flex shadow-footer px-3 py-1.5'>
      <div
        className={`footer-box flex-1 flex justify-center items-center rounded-full hover:cursor-pointer bg-brandOrange`}
        onClick={onClick}
      >
        <span className='footer-text text-white font-bold text-lg'>{footerText}</span>
      </div>
    </nav>
  );
};
export default OneButtonFooterLayout;
