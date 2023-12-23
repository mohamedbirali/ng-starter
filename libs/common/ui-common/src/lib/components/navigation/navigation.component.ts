import { User } from '@angular/fire/auth';
import { FireAuthService } from '@firebase';
import { LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerComponent } from '../spinner/spinner.component';
@Component({
  selector: 'ui-common-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListModule,
    RouterLink,
    RouterLinkActive,
    NgClass,
    TitleCasePipe,
    LowerCasePipe,
    MatIconModule,
    SpinnerComponent,
    MatTooltipModule,
  ],
  templateUrl: './navigation.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent {
  router = inject(Router);

  #_fireAuthService = inject(FireAuthService);
  user: User | null = null;
  #_ = this.#_fireAuthService.user$().subscribe((u: any) => (this.user = u));
  isSpin = false;

  async logout() {
    this.isSpin = true;
    try {
      await this.#_fireAuthService.signOut();
      this.router.navigateByUrl('login');
    } catch (error) {
      this.isSpin = false;
    }
  }

  @Output()
  toggle = new EventEmitter();

  // todo
  @Input({ required: true })
  routes: any; // todo

  onToggle() {
    this.toggle.emit();
  }
}
