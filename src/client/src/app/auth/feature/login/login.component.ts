import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../data-access/auth.service';
import { LoginCardComponent } from '../../ui/login-card/login-card.component';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginCardComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  onLogin(): void {
    this.authService.initiateGoogleLogin();
  }
}
