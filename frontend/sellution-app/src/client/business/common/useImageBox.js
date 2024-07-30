import { useCallback, useRef, useState } from 'react';

export const useImageBox = ({
  onUploadSuccess,
  onDataChange,
  onBeforeRemove,
  onEditImage,
  maxImageCount,
  images,
  setImages,
  setSelectedImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

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
        onDataChange && onDataChange(updatedImages);
      }
    };
  };

  return {
    isDragging,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleImageUpload,
    removeImage,
    editImage,
  };
};
