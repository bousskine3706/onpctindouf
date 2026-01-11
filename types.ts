
export enum HeritageCategory {
  MATERIAL = 'تراث ثقافي مادي',
  IMMATERIAL = 'تراث ثقافي لامادي'
}

export enum CulturalStyle {
  HASSANI = 'حساني',
  SAHRAWI = 'صحراوي',
  OTHER = 'آخر'
}

export enum LocationType {
  DISCOVERY = 'اكتشاف',
  PRESERVATION = 'حفظ',
  DISPLAY = 'عرض'
}

export interface InventoryItem {
  id: string;
  inventoryNumber: string;
  name: string;
  category: HeritageCategory;
  culturalField?: string;
  
  // Technical Description
  material: string;
  technique: string;
  shape: string;
  ornamentation: string;
  color: string;
  physicalStatus: string;
  
  // Measurements
  diameter?: number;
  width?: number;
  thickness?: number;
  weight?: number;
  
  // Cultural Context
  function: string;
  socialUsage: string;
  symbolicMeaning: string;
  culturalStyle: CulturalStyle;
  
  // History
  historicalPeriod: string;
  datingMethod: string;
  placeOfOrigin: string;
  maker: string;
  acquisitionMethod: string;
  
  // Legal
  ownership: string;
  legalStatus: string;
  isDisplayable: boolean;
  
  // Conservation
  conservationState: string;
  storageConditions: string;
  notes: string;
  
  // Media & GIS
  images: string[]; // Base64 or local paths
  video?: string;
  model3d?: string;
  gps: {
    lat: number;
    lng: number;
    type: LocationType;
  };
  
  createdAt: number;
  updatedAt: number;
}

export enum UserRole {
  RESEARCHER = 'باحث تراث',
  TECHNICIAN = 'تقني جرد',
  ADMIN = 'إداري'
}

export interface User {
  username: string;
  role: UserRole;
}
