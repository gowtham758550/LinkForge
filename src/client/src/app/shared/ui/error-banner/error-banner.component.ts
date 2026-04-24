import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
  templateUrl: './error-banner.component.html',
})
export class ErrorBannerComponent {
  readonly message = input.required<string>();
  readonly dismiss = output<void>();

  readonly faExclamation = faCircleExclamation;
  readonly faXmark = faXmark;
}
