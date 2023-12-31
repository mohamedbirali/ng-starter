import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestoryService } from './destory.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'izi-destory',
  standalone: true,
  imports: [RouterModule],
  template: `<p>check logs <a [routerLink]="['../input']"> input ? </a></p>`,
  providers: [DestoryService],
})
export class DestoryComponent {
  destroyRef = inject(DestroyRef);
  private _destroyService = inject(DestoryService);

  constructor() {
    this._destroyService.mockData$.pipe(takeUntilDestroyed()).subscribe({
      next: (mock: string) => {
        mock;
      },
    });
  }
}
