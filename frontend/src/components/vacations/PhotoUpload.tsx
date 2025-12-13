import { useRef, useState, ChangeEvent } from 'react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File | null) => void;
  currentPhotoUrl?: string | null;
  disabled?: boolean;
}

export const PhotoUpload = ({ onPhotoSelect, currentPhotoUrl, disabled = false }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setPreview(currentPhotoUrl || null);
      onPhotoSelect(null);
      return;
    }

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Validate file type - iOS may send empty or incorrect MIME types for HEIC/images
    // So we check both MIME type and file extension
    const isImageMimeType = file.type.startsWith('image/');
    const fileExtension = file.name.toLowerCase().split('.').pop() || '';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'bmp', 'svg', 'tiff', 'tif'];
    const hasImageExtension = imageExtensions.includes(fileExtension);

    // Accept if either MIME type is image/* OR file has image extension
    // This handles iOS sending HEIC with empty/wrong MIME type
    if (!isImageMimeType && !hasImageExtension) {
      const errorMsg = `Invalid file type: ${file.type} (${file.name}). Please select an image file.`;
      console.error(errorMsg);
      setError('Please select an image file');
      return;
    }

    console.log('File validation passed:', {
      isImageMimeType,
      hasImageExtension,
      fileExtension
    });

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      const errorMsg = `File size (${sizeMB}MB) exceeds maximum of 10MB`;
      console.error(errorMsg);
      setError('File size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      console.log('Preview created successfully');
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);

    onPhotoSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Photo (Optional)</label>

      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center group">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 transition-colors duration-200 flex flex-col items-center justify-center text-gray-500 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Click to upload a photo</span>
          <span className="text-xs mt-1">Any image format (max 10MB)</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
