import { NgOptimizedImage, provideImgixLoader, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'ui-common-img',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, MatTooltipModule, NgClass],
  providers: [provideImgixLoader(environment.imageLoader)],
  template: `
    <img
      class="rounded-full shadow-md p-0"
      [ngSrc]="source"
      [width]="width"
      [height]="height"
      [matTooltip]="tooltip"
      [matTooltipPosition]="'above'"
      [ngClass]="styles"
      [loading]="'lazy'"
    />
  `,
})
export class ImageComponent {
  @Input({ required: true })
  source!: string;

  @Input({ required: true })
  tooltip!: string;

  @Input({ required: true })
  width!: number;

  @Input({ required: true })
  height!: number;

  @Input()
  styles: string | string[] = '';
}
