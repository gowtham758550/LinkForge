import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="skeleton" [style.width]="width()" [style.height]="height()"></div>`,
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
}
