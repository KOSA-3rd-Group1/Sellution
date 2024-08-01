const LoadingSpinner = () => (
  <div className='w-full h-full flex justify-center items-center'>
    <div className='flex space-x-2 justify-center items-center h-full'>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className='w-4 h-4 bg-primary rounded-full animate-bounce'
          style={{ animationDelay: `${index * 0.1}s` }}
        ></div>
      ))}
    </div>
  </div>
);
export default LoadingSpinner;
