const ToggleButton = ({ isToggled, handleToggle }) => {
  return (
    <button
      onClick={handleToggle}
      className={`relative w-16 h-7 inline-flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandOrange transition-colors duration-200 ease-in-out ${
        isToggled ? 'bg-brandOrange' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute flex items-center justify-center w-5 h-5 transition-transform duration-200 ease-in-out transform ${
          isToggled ? 'translate-x-10' : 'translate-x-1'
        } bg-white rounded-full shadow`}
      />
      <span
        className={`absolute inset-0 flex items-center ${
          isToggled ? 'justify-start pl-2' : 'justify-end pr-3'
        }`}
      >
        <span className={`text-xs font-bold ${isToggled ? 'text-white' : 'text-gray-900'}`}>
          {isToggled ? 'ON' : 'OFF'}
        </span>
      </span>
    </button>
  );
};

export default ToggleButton;
