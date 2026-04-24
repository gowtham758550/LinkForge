import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { ConfirmDialogComponent } from './shared/ui/confirm-dialog/confirm-dialog.component';
import { AuthStore } from './auth/data-access/auth.store';
import { ThemeStore } from './shared/data-access/theme.store';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly themeStore = inject(ThemeStore);

  ngOnInit(): void {
    if (this.authStore.token()) {
      this.authStore.loadUser();
    }
  }
}
