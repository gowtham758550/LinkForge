import { Injectable, signal } from '@angular/core';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve: ((v: boolean) => void) | null;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly _state = signal<ConfirmState>({
    open: false,
    title: '',
    message: '',
    resolve: null,
  });

  readonly state = this._state.asReadonly();

  ask(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this._state.set({ ...options, open: true, resolve });
    });
  }

  respond(value: boolean): void {
    const s = this._state();
    s.resolve?.(value);
    this._state.set({ ...s, open: false, resolve: null });
  }
}
