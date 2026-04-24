export interface ShortenedUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
  trackEveryClick: boolean;
}

export interface DailyClickPoint {
  date: string;
  count: number;
}

export interface UrlAnalytics {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt: string | null;
  clicksByDay: DailyClickPoint[];
  trackEveryClick: boolean;
}

export interface ShortenUrlRequest {
  longUrl: string;
  customAlias: string | null;
  expiresAt: string | null;
  trackEveryClick: boolean;
}
