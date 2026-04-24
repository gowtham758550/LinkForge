import { ChangeDetectionStrategy, Component, input, output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ShortenUrlRequest } from '../../../core/models/url.model';

@Component({
  selector: 'app-shorten-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FaIconComponent],
  templateUrl: './shorten-form.component.html',
})
export class ShortenFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly submitting = input(false);
  readonly shortened = output<ShortenUrlRequest>();

  readonly form = this.fb.group({
    longUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    customAlias: [''],
    expiresAt: [''],
  });

  readonly trackEveryClick = signal(false);
  readonly faLink = faLink;

  onSubmit(): void {
    if (this.form.invalid) return;
    const { longUrl, customAlias, expiresAt } = this.form.getRawValue();
    this.shortened.emit({
      longUrl: longUrl!,
      customAlias: customAlias || null,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      trackEveryClick: this.trackEveryClick(),
    });
  }

  reset(): void {
    this.form.reset({ longUrl: '', customAlias: '', expiresAt: '' });
    this.trackEveryClick.set(false);
  }
}
