import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ShortenUrlRequest } from '../../../core/models/url.model';
import { UrlStore } from '../../data-access/url.store';
import { UrlService } from '../../data-access/url.service';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { NotifyService } from '../../../shared/data-access/notify.service';
import { ConfirmService } from '../../../shared/data-access/confirm.service';
import { ShortenFormComponent } from '../../ui/shorten-form/shorten-form.component';
import { UrlListComponent } from '../../ui/url-list/url-list.component';
import { ErrorBannerComponent } from '../../../shared/ui/error-banner/error-banner.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { DashboardSkeletonComponent } from '../../../shared/ui/skeleton/dashboard-skeleton.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ShortenFormComponent,
    UrlListComponent,
    ErrorBannerComponent,
    EmptyStateComponent,
    DashboardSkeletonComponent,
    FaIconComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  readonly urlStore = inject(UrlStore);
  readonly authStore = inject(AuthStore);
  private readonly urlService = inject(UrlService);
  private readonly notify = inject(NotifyService);
  private readonly confirm = inject(ConfirmService);

  readonly shortenForm = viewChild<ShortenFormComponent>('shortenForm');
  readonly faLink = faLink;

  ngOnInit(): void {
    this.urlStore.loadUrls();
  }

  onShorten(request: ShortenUrlRequest): void {
    this.urlStore.setSubmitting(true);
    this.urlStore.clearError();
    this.urlService.shorten(request).subscribe({
      next: url => {
        this.urlStore.prependUrl(url);
        this.urlStore.setSubmitting(false);
        this.shortenForm()?.reset();
        this.notify.success('Link shortened');
      },
      error: err => {
        this.urlStore.setSubmitting(false);
        const msg =
          err?.status === 409
            ? 'That custom alias is already taken.'
            : 'Failed to shorten URL. Please try again.';
        this.urlStore.setError(msg);
      },
    });
  }

  async onDelete(shortCode: string): Promise<void> {
    const ok = await this.confirm.ask({
      title: 'Delete link?',
      message: 'This link will stop resolving immediately. This action cannot be undone.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;

    this.urlService.delete(shortCode).subscribe({
      next: () => {
        this.urlStore.removeUrl(shortCode);
        this.notify.success('Link deleted');
      },
      error: () => this.urlStore.setError('Failed to delete link.'),
    });
  }

  onCopy(url: string): void {
    navigator.clipboard
      .writeText(url)
      .then(() => this.notify.success('Copied'))
      .catch(() => this.notify.error('Copy failed'));
  }
}
