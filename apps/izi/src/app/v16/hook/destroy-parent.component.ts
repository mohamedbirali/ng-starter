import { Component, ViewChild } from '@angular/core';
import { DestoryComponent } from './destory.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'izi-destroy-parent',
  standalone: true,
  imports: [DestoryComponent, RouterModule],
  template: `<izi-destory></izi-destory>`,
})
export class DestroyParentComponent {
  @ViewChild(DestoryComponent) destoryComponent!: DestoryComponent;

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destoryComponent?.destroyRef))
      .subscribe((count) => count);
  }
}
