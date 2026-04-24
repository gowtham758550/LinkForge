import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmService } from '../../data-access/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly confirm = inject(ConfirmService);
}
