import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { ThemeStore } from '../../data-access/theme.store';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  readonly themeStore = inject(ThemeStore);
  readonly faSun = faSun;
  readonly faMoon = faMoon;
  readonly faDesktop = faDesktop;
}
