import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  afterRender,
} from '@angular/core';

@Component({
  selector: 'izi-render',
  standalone: true,
  template: `<span #content class="h-2">{{
    'This component is for the render hook, check logs'
  }}</span>`,
})
export class RenderComponent {
  @ViewChild('content') contentRef!: ElementRef;

  constructor() {
    afterRender(() => {
      'content height: ' + this.contentRef.nativeElement.scrollHeight;
    });

    afterNextRender(() => {
      ('Ohayo');
    });
  }
}
