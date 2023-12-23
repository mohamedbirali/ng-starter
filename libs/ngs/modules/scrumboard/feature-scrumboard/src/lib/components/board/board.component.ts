import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';
import { ScrumboardBoardAddCardComponent } from './add-card/add-card.component';
import { ScrumboardBoardAddListComponent } from './add-list/add-list.component';
import { Board, List, Card } from '@ngs/modules/data-access-scrumboard';
import { ScrumboardFacade } from '../../services/scrumboard.facade';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'feature-scrumboard-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    //
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    //
    RouterLink,
    MatIconModule,
    CdkScrollable,
    CdkDropList,
    CdkDropListGroup,
    NgFor,
    CdkDrag,
    CdkDragHandle,
    MatMenuModule,
    MatTooltipModule,
    NgIf,
    NgClass,
    ScrumboardBoardAddCardComponent,
    ScrumboardBoardAddListComponent,
    RouterOutlet,
    DatePipe,
  ],
})
export class ScrumboardBoardComponent implements OnInit, OnDestroy {
  board!: Board;
  listTitleForm!: UntypedFormGroup;
  boardForm!: UntypedFormGroup;

  // Private
  readonly #_positionStep: number = 65536;
  readonly #_maxListCount: number = 200;
  readonly #_maxPosition: number = this.#_positionStep * 500;
  #_unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _scrumboardService: ScrumboardFacade,
  ) {}

  ngOnInit(): void {
    // Initialize the list title form
    this.listTitleForm = this._formBuilder.group({
      title: [''],
    });

    this.boardForm = this._formBuilder.group({
      id: [''],
      title: [''],
      description: [''],
      icon: [''],
      // todo
      // members: [''],
      // labels: ['']
    });

    // Get the board
    this._scrumboardService
      .getBoard$(this._router.url.split('/')[2])
      .pipe(takeUntil(this.#_unsubscribeAll))
      .subscribe((board: any) => {
        this.board = { ...board };
        this.boardForm.patchValue(board);
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.#_unsubscribeAll.next(null);
    this.#_unsubscribeAll.complete();
  }

  renameList(listTitleInput: HTMLElement): void {
    // Use timeout so it can wait for menu to close
    setTimeout(() => {
      listTitleInput.focus();
    });
  }

  addList(title: string): void {
    // Limit the max list count
    if (this.board?.lists?.length >= this.#_maxListCount) {
      return;
    }

    // Create a new list model
    const list = {
      title,
      boardId: this.board.id!,
      position: this.board?.lists?.length ?? 0,
    } as List;

    // Save the list
    this._scrumboardService.createList(list);
  }

  updateListTitle(event: any, list: List): void {
    // Get the target element
    const element: HTMLInputElement = event.target;

    // Get the new title
    const newTitle = element.value;

    // If the title is empty...
    if (!newTitle || newTitle.trim() === '') {
      // Reset to original title and return
      element.value = list.title;
      return;
    }

    // Update the list title and element value
    list.title = element.value = newTitle.trim();

    // Update the list
    this._scrumboardService.updateList(list);
  }

  deleteList(id: string): void {
    this._scrumboardService.deleteList(id);
  }

  addCard(list: List, title: string): void {
    // Create a new card model
    const card = {
      boardId: this.board.id!,
      listId: list.id!,
      position: list?.cards?.length
        ? list.cards[list.cards.length - 1].position + this.#_positionStep
        : this.#_positionStep,
      title: title,
    } as Card;

    // Save the card
    this._scrumboardService.createCard(card);
  }

  listDropped(event: CdkDragDrop<List[]>): void {
    // Move the item
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const lists = {
      curr: {
        id: event.container.data.find(
          (list, idx) => idx === event.previousIndex,
        )?.id,
        replacePositionWith: event.previousIndex,
      },
      prev: {
        id: event.container.data.find((list, idx) => idx === event.currentIndex)
          ?.id,
        replacePositionWith: event.currentIndex,
      },
    };

    // Update the lists
    if (lists.curr.id && lists.prev.id) {
      this._scrumboardService.updateLists(lists);
    }
  }

  cardDropped(event: CdkDragDrop<Card[]>): void {
    const prevCard = event.previousContainer.data[event.previousIndex];
    const currList = event.container.data[0]?.listId;
    this._scrumboardService.updateCard(prevCard.id ?? '', {
      listId: currList,
      position: +event.currentIndex,
    } as Card);
  }

  updateBoard() {
    this._scrumboardService.updateBoard(this.boardForm.value);
  }

  deleteBoard() {
    this._scrumboardService.deleteBoard(this.board.id ?? '');
    this._router.navigateByUrl('scrumboard');
  }

  isOverdue(date: string): boolean {
    return (
      DateTime.fromISO(date).startOf('day') < DateTime.now().startOf('day')
    );
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // private
  private _calculatePositions(event: CdkDragDrop<any[]>): any[] {
    // Get the items
    let items = event.container.data;
    const currentItem = items[event.currentIndex];
    const prevItem = items[event.currentIndex - 1] || null;
    const nextItem = items[event.currentIndex + 1] || null;

    // If the item moved to the top...
    if (!prevItem) {
      // If the item moved to an empty container
      if (!nextItem) {
        currentItem.position = this.#_positionStep;
      } else {
        currentItem.position = nextItem.position / 2;
      }
    }
    // If the item moved to the bottom...
    else if (!nextItem) {
      currentItem.position = prevItem.position + this.#_positionStep;
    }
    // If the item moved in between other items...
    else {
      currentItem.position = (prevItem.position + nextItem.position) / 2;
    }

    // Check if all item positions need to be updated
    if (
      !Number.isInteger(currentItem.position) ||
      currentItem.position >= this.#_maxPosition
    ) {
      // Re-calculate all orders
      items = items.map((value, index) => {
        value.position = (index + 1) * this.#_positionStep;
        return value;
      });

      // Return items
      return items;
    }

    // Return currentItem
    return [currentItem];
  }
}
