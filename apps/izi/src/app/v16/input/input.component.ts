import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'izi-input',
  standalone: true,
  template: `
    <p>{{ fromPathParams }}</p>
    <p>{{ fromData }}</p>
    <p>{{ fromResolver }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  // required: means that if we use this child this input is reguired
  // transform: only if set outside the component, `no parameter found` will always be lowerCase
  @Input({
    required: false,
    transform: (value?: string) => value?.toUpperCase(),
  })
  fromPathParams?: string = 'no parameter found';

  @Input({ required: true })
  fromData?: string;

  @Input({ required: true, transform: booleanAttribute }) // <izi-input fromResolver />
  fromResolver?: string | boolean; // or boolean is mandatory

  @Input({ transform: numberAttribute }) // <izi-input forTest=20 />
  forTest?: string | number; // or number is mandatory
}
