export interface ErrorResponseMessage {
  message: string;
}

export interface Schedule {
  date: string;
  endTime: string;
  startTime: string;
}

export interface Activity {
  address: string;
  bannerImageUrl: string;
  category: string;
  description: string;
  price?: string;
  schedules: Schedule[];
  subImageUrls?: string[];
  title: string;
}

export interface SubImage {
  id?: number;
  imageUrl: string;
}

export interface ActivityDetail extends Activity {
  createdAt: string;
  id: number;
  rating: number;
  reviewCount: number;
  schedules: EditSchedule[];
  subImages: SubImage[];
  updatedAt: string;
  userId: number;
}

export interface EditSchedule {
  date: string;
  endTime: string;
  id?: number;
  startTime: string;
}

export interface EditDetail {
  schedules: EditSchedule[];
  subImages: SubImage[];
}

export interface ActivityEdit {
  address: string;
  bannerImageUrl: string;
  category: string;
  description: string;
  price?: string;
  scheduleIdsToRemove: number[];
  schedulesToAdd: Schedule[];
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  title: string;
}
