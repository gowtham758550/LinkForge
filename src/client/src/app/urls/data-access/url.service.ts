import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ShortenedUrl, ShortenUrlRequest, UrlAnalytics } from '../../core/models/url.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/urls`;

  getAll(filter: string = 'all') {
    return this.http.get<ShortenedUrl[]>(this.base, { params: { filter } });
  }

  shorten(request: ShortenUrlRequest) {
    return this.http.post<ShortenedUrl>(this.base, request);
  }

  delete(shortCode: string) {
    return this.http.delete<void>(`${this.base}/${shortCode}`);
  }

  getAnalytics(shortCode: string) {
    return this.http.get<UrlAnalytics>(`${this.base}/${shortCode}/analytics`);
  }
}
