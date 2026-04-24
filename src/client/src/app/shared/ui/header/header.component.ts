import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faLink,
  faRightFromBracket,
  faGaugeHigh,
  faChevronDown,
  faSun,
  faMoon,
  faDesktop,
} from '@fortawesome/free-solid-svg-icons';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { ThemeStore } from '../../data-access/theme.store';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);
  readonly themeStore = inject(ThemeStore);
  readonly menuOpen = signal(false);

  readonly faLink = faLink;
  readonly faGaugeHigh = faGaugeHigh;
  readonly faRightFromBracket = faRightFromBracket;
  readonly faChevronDown = faChevronDown;
  readonly faSun = faSun;
  readonly faMoon = faMoon;
  readonly faDesktop = faDesktop;

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.authStore.logout();
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.themeStore.setTheme(theme);
  }
}
