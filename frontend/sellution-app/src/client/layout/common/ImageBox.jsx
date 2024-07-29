import { ImageUploadIcon, EditIcon, TrashIcon } from '@/client/utility/assets/Icons';
import { useImageBox } from '@/client/business/common/useImageBox';

const ImageBox = ({
  TitleTag,
  inputId,
  onUploadSuccess,
  onBeforeRemove,
  onEditImage,
  onDataChange,
  isMultiImage,
  containerHeight,
  previewSize,
  maxImageCount,
  images,
  setImages,
  selectedImage,
  setSelectedImage,
  ...inputAttr
}) => {
  const {
    isDragging,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleImageUpload,
    removeImage,
    editImage,
  } = useImageBox({
    onUploadSuccess,
    onDataChange,
    onBeforeRemove,
    onEditImage,
    maxImageCount,
    images,
    setImages,
    setSelectedImage,
  });

  return (
    <li
      className={`relative pl-4 py-4 ${containerHeight} flex justify-between items-start gap-10 border-b`}
    >
      <div className='flex-1 min-w-64'>
        {TitleTag}
        {isMultiImage && images.length > 0 && (
          <div className='flex space-x-3 pb-2'>
            {images.map((image) => (
              <div key={image?.id} className='relative flex-shrink-0'>
                <img
                  src={image?.preview}
                  alt={`preview ${image.id}`}
                  className={`w-12 h-12 object-cover rounded-lg shadow-md cursor-pointer transition-color duration-200 ${selectedImage && selectedImage.id === image.id ? 'ring-2 ring-brandOrange ring-offset-2' : 'hover:shadow-lg'}`}
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
            {images.length < maxImageCount && (
              <div className='flex-shrink-0'>
                <input
                  type='file'
                  {...inputAttr}
                  onChange={handleImageUpload}
                  className='hidden'
                  id={`${inputId}-more`}
                />
                <label
                  htmlFor={`${inputId}-more`}
                  className='w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-200'
                >
                  <ImageUploadIcon className='w-10 h-10 text-gray-400' />
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex-1 space-y-4 h-full'>
        <div
          className={`min-w-64 h-full p-2 border-2 border-dashed rounded-lg ${isDragging ? 'border-brandOrange bg-brandOrange-light' : 'border-gray-300 bg-gray-50'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedImage ? (
            <div className='relative h-full flex justify-center items-center'>
              <img
                src={selectedImage?.preview}
                alt='Selected preview'
                className={`${previewSize} ${inputId === 'file-upload-logo' ? 'object-contain' : 'object-cover'} rounded-lg shadow-lg`}
              />
              <div className='absolute right-1 flex flex-col justify-center gap-2'>
                <button
                  onClick={() => editImage(selectedImage)}
                  className='p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200'
                >
                  <EditIcon className='h-5 w-5 text-gray-600' />
                </button>
                <button
                  onClick={() => removeImage(selectedImage)}
                  className='p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200'
                >
                  <TrashIcon className='h-5 w-5 text-red-500' />
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor={inputId}
              className='h-full flex flex-col justify-center gap-2 cursor-pointer text-center hover:bg-gray-100 transition duration-200 rounded-lg'
            >
              <ImageUploadIcon className='mx-auto h-10 w-10 text-gray-400' />

              <p className='text-sm text-gray-600'>Click here or drag and drop</p>
              <input
                type='file'
                {...inputAttr}
                onChange={handleImageUpload}
                className='hidden '
                id={inputId}
              />
            </label>
          )}
        </div>
      </div>
      <input type='file' ref={fileInputRef} className='hidden' onChange={() => {}} />
    </li>
  );
};
export default ImageBox;
