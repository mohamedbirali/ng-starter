import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'ui-common-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule],
  template: `<mat-spinner [color]="'primary'" [diameter]="diameter" />`,
})
export class SpinnerComponent {
  @Input({ required: false })
  diameter: number = 30;
}
