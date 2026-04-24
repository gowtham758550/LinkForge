export interface ShortenedUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  expiresAt: string | null;
  clickCount: number;
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
}

export interface ShortenUrlRequest {
  longUrl: string;
  customAlias: string | null;
  expiresAt: string | null;
}
