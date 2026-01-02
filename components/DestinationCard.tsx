
import React from 'react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  isSelected: boolean;
  onSelect: (dest: Destination) => void;
  t: any;
  rank?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, isSelected, onSelect, t, rank }) => {
  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div
      onClick={() => onSelect(destination)}
      className={`relative group overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-indigo-500 scale-[1.02]' : 'hover:scale-[1.02] shadow-sm'
      }`}
    >
      <div className="aspect-[4/3] w-full relative overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
        
        {rank !== undefined && rank < 3 && (
          <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
            <i className="fa-solid fa-fire text-red-600"></i>
            {t.popularBadge}
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          <div className="bg-white/10 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-white/20">
            <i className="fa-solid fa-location-dot mr-1 text-red-400"></i>
            {formatCount(destination.checkIns)} {t.checkInsLabel}
          </div>
          {destination.sourceUrl && (
            <a 
              href={destination.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-indigo-600/80 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[9px] font-bold hover:bg-indigo-500"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fa-solid fa-map-location-dot mr-1"></i>
              {t.viewSource}
            </a>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-indigo-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {t.regions[destination.region] || destination.region}
          </span>
          <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {t.types[destination.type] || destination.type}
          </span>
        </div>
        <h3 className="text-lg font-bold leading-tight">{destination.name}</h3>
        <p className="text-xs text-gray-300">{destination.country}</p>
      </div>

      {isSelected && (
        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center pointer-events-none">
          <div className="bg-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl scale-110">
            <i className="fa-solid fa-check text-xl"></i>
          </div>
        </div>
      )}
    </div>
  );
};
