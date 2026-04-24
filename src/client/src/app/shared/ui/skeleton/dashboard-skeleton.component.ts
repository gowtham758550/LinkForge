import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';
import { UrlCardSkeletonComponent } from './url-card-skeleton.component';

@Component({
  selector: 'app-dashboard-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent, UrlCardSkeletonComponent],
  template: `
    <div class="space-y-6">
      <div class="space-y-2">
        <app-skeleton width="40%" height="1.75rem" />
        <app-skeleton width="20%" height="1rem" />
      </div>
      <div class="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
        <app-skeleton height="2.5rem" />
        <div class="flex gap-4">
          <app-skeleton height="2.5rem" />
          <app-skeleton height="2.5rem" />
          <app-skeleton width="140px" height="2.5rem" />
        </div>
      </div>
      <div class="space-y-3">
        @for (_ of [1, 2, 3]; track $index) {
          <app-url-card-skeleton />
        }
      </div>
    </div>
  `,
})
export class DashboardSkeletonComponent {}
