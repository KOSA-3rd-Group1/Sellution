const DetailInformationLayout = ({ listImages }) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col w-[90%]'>
        {listImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};
export default DetailInformationLayout;
