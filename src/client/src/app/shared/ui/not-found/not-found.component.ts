import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLinkSlash, faLink, faGaugeHigh, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  readonly faLinkSlash = faLinkSlash;
  readonly faLink = faLink;
  readonly faGaugeHigh = faGaugeHigh;
  readonly faXmark = faXmark;
}
