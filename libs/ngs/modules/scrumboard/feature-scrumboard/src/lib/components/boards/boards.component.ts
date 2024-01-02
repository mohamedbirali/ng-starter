import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import { Board } from '@ngs/modules/data-access-scrumboard';
import { ScrumboardFacade } from '../../services/scrumboard.facade';
import { MatDialog } from '@angular/material/dialog';
import { AddBoardComponent } from './add-board/add-board.component';
import { fadeInUp400ms } from '@common/ui-common';

@Component({
  selector: 'feature-scrumboard-boards',
  templateUrl: './boards.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [CdkScrollable, RouterLink, MatIconModule],
})
export class ScrumboardBoardsComponent implements OnInit, OnDestroy {
  boards!: Board[];
  dialog = inject(MatDialog);
  // Private
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _scrumboardService: ScrumboardFacade,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the boards
    this._scrumboardService
      .getBoards$()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((boards: any) => {
        this.boards = boards;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  openAddBoard() {
    this.dialog.open(AddBoardComponent);
  }

  /**
   * Format the given ISO_8601 date as a relative date
   *
   * @param date
   */
  formatDateAsRelative(date: string): string {
    return DateTime.fromISO(date).toRelative()!;
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
