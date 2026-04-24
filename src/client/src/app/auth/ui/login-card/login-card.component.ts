import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
  templateUrl: './login-card.component.html',
})
export class LoginCardComponent {
  readonly loginClick = output<void>();
  readonly faLink = faLink;
  readonly faGoogle = faGoogle;
}
