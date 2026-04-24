import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-url-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent],
  template: `
    <div
      class="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
    >
      <app-skeleton width="48px" height="48px" />
      <div class="flex-1 space-y-2">
        <app-skeleton width="70%" height="0.875rem" />
        <app-skeleton width="40%" height="0.75rem" />
      </div>
      <div class="flex gap-2">
        <app-skeleton width="32px" height="32px" />
        <app-skeleton width="32px" height="32px" />
        <app-skeleton width="32px" height="32px" />
      </div>
    </div>
  `,
})
export class UrlCardSkeletonComponent {}
