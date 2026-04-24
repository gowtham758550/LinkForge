import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  readonly copyClick = output<string>();
  readonly deleteClick = output<string>();

  readonly faLink = faLink;
  readonly faCopy = faCopy;
  readonly faChart = faChartColumn;
  readonly faTrash = faTrash;

  onCopy(): void {
    this.copyClick.emit(this.url().shortUrl);
  }
}
