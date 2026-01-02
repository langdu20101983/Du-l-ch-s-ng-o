
export enum Region {
  EUROPE = 'Europe',
  ASIA = 'Asia',
  AMERICAS = 'Americas',
  AFRICA = 'Africa',
  OCEANIA = 'Oceania'
}

export enum TravelType {
  CULTURAL = 'Cultural',
  ADVENTURE = 'Adventure',
  NATURE = 'Nature',
  URBAN = 'Urban',
  RELAXATION = 'Relaxation'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  TALL = '9:16',
  WIDE = '16:9'
}

export enum ClothingStyle {
  AUTO = 'Auto',
  CASUAL = 'Casual',
  FORMAL = 'Formal',
  WINTER = 'Winter',
  SUMMER = 'Summer',
  TRADITIONAL = 'Traditional',
  LUXURY = 'Luxury'
}

export enum ImageQuality {
  Q1K = '1K',
  Q2K = '2K',
  Q4K = '4K'
}

export type Language = 'en' | 'vi';

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: Region;
  type: TravelType;
  image: string;
  description: string;
  checkIns: number;
  isGlobal?: boolean;
  sourceUrl?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
