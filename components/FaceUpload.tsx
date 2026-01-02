
import React, { useRef } from 'react';

interface FaceUploadProps {
  images: string[];
  onAddImage: (img: string) => void;
  onRemoveImage: (index: number) => void;
  t: any;
}

export const FaceUpload: React.FC<FaceUploadProps> = ({ images, onAddImage, onRemoveImage, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAddImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">{t.faceLabel}</label>
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative group w-20 h-20">
            <img src={img} alt={`Face ${idx}`} className="w-full h-full object-cover rounded-xl border-2 border-indigo-100 shadow-sm" />
            <button
              onClick={() => onRemoveImage(idx)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fa-solid fa-times text-xs"></i>
            </button>
          </div>
        ))}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-all text-gray-400 hover:text-indigo-600"
        >
          <i className="fa-solid fa-plus text-xl mb-1"></i>
          <span className="text-[10px] font-medium uppercase tracking-wider">{t.addBtn}</span>
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <p className="text-xs text-gray-500">{t.faceDesc}</p>
    </div>
  );
};
