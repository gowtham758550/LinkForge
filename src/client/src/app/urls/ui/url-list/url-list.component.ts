import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ShortenedUrl } from '../../../core/models/url.model';
import { UrlCardComponent } from '../url-card/url-card.component';

@Component({
  selector: 'app-url-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrlCardComponent],
  templateUrl: './url-list.component.html',
})
export class UrlListComponent {
  readonly urls = input.required<ShortenedUrl[]>();
  readonly isAllFilter = input<boolean>(false);
  readonly copyClick = output<string>();
  readonly deleteClick = output<string>();
}
