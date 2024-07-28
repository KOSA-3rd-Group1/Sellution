import { useState, useCallback, useRef, useEffect } from 'react';
import { ImageUploadIcon, EditIcon, TrashIcon } from '@/client/utility/assets/Icons';

const ImageUploader2 = ({
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
  initialImages = [],
  ...inputAttr
}) => {
  const [images, setImages] = useState(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  useEffect(() => {
    // null 체크를 추가하고 유효한 배열인지 확인
    if (Array.isArray(initialImages) && initialImages.length > 0) {
      setImages(initialImages);
      setSelectedImage(initialImages[0]);
    }
  }, [initialImages]);

  console.log('이미지스', images);
  const handleFiles = useCallback(
    (files) => {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Date.now() + Math.random(),
      }));
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setSelectedImage(newImages[0] || updatedImages[0]);
      onUploadSuccess && onUploadSuccess(newImages);
      onDataChange && onDataChange(updatedImages);
    },
    [images, onUploadSuccess, onDataChange],
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      const { files } = e.dataTransfer;
      //   console.log('files', files);
      if (images.length + files.length <= maxImageCount) {
        handleFiles(files);
      } else {
        alert(`이미지는 최대 ${maxImageCount}개까지 가능합니다.`);
      }
    },
    [handleFiles],
  );

  const handleImageUpload = useCallback(
    (e) => {
      const { files } = e.target;
      if (images.length + files.length <= maxImageCount) {
        handleFiles(files);
      } else {
        alert(`이미지는 최대 ${maxImageCount}개까지 가능합니다.`);
      }
    },
    [handleFiles],
  );

  const removeImage = async (imageToRemove) => {
    if (onBeforeRemove) {
      const index = images.findIndex((img) => img.id === imageToRemove.id);
      const canRemove = await onBeforeRemove(imageToRemove, index);
      if (!canRemove) return;
    }
    const updatedImages = images.filter((img) => img.id !== imageToRemove.id);
    setImages(updatedImages);
    setSelectedImage(updatedImages[0] || null);
    onDataChange && onDataChange(updatedImages);
  };

  const editImage = (image) => {
    fileInputRef.current.click();
    fileInputRef.current.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const updatedImage = {
          ...image,
          file,
          preview: URL.createObjectURL(file),
        };
        const updatedImages = images.map((img) => (img.id === image.id ? updatedImage : img));
        if (onEditImage) {
          const index = images.findIndex((img) => img.id === image.id);
          const canEdit = await onEditImage(updatedImages, index);
          if (!canEdit) return;
        }

        setImages(updatedImages);
        setSelectedImage(updatedImage);
        // onEditImage &&
        //   onEditImage(
        //     updatedImage,
        //     images.findIndex((img) => img.id === image.id),
        //   );
        onDataChange && onDataChange(updatedImages);
      }
    };
  };

  return (
    <div
      className={`relative w-full ${containerHeight} flex flex-col md:flex-row justify-between items-start gap-4`}
    >
      <div className='w-full md:w-1/2 space-y-4'>
        {TitleTag}
        {isMultiImage && images.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {images.map((image) => (
              <div key={image.id} className='relative flex-shrink-0'>
                <img
                  src={image.preview}
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

      <div className='w-full md:w-1/2'>
        <div
          className={`w-full h-full p-2 border-2 border-dashed rounded-lg ${isDragging ? 'border-brandOrange bg-brandOrange-light' : 'border-gray-300 bg-gray-50'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedImage ? (
            <div className='relative h-full flex justify-center items-center'>
              <img
                src={selectedImage.preview}
                alt='Selected preview'
                className={`${previewSize} object-cover rounded-lg shadow-lg`}
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
    </div>
  );
};
export default ImageUploader2;
