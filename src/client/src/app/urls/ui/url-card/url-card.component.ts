import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCopy, faChartColumn, faTrash, faLink } from '@fortawesome/free-solid-svg-icons';
import { ShortenedUrl } from '../../../core/models/url.model';

@Component({
  selector: 'app-url-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, FaIconComponent],
  templateUrl: './url-card.component.html',
})
export class UrlCardComponent {
  readonly url = input.required<ShortenedUrl>();
  readonly isAllFilter = input<boolean>(false);
  readonly copyClick = output<string>();
  readonly deleteClick = output<string>();

  readonly faLink = faLink;
  readonly faCopy = faCopy;
  readonly faChart = faChartColumn;
  readonly faTrash = faTrash;

  readonly isExpired = computed(() => {
    const expiresAt = this.url().expiresAt;
    return !!expiresAt && new Date(expiresAt) <= new Date();
  });

  onCopy(): void {
    this.copyClick.emit(this.url().shortUrl);
  }
}
