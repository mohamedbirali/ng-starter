import { Component, Input } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  standalone: true,
  selector: 'izi-user',
  templateUrl: './user.component.html',
})
export class UserComponent {
  @Input({ required: true })
  users!: User[];
}
