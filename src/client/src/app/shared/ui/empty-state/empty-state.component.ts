import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly icon = input.required<IconDefinition>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
