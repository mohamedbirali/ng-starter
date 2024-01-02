import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import {
  IAction,
  IActionName,
  IColumn,
  IEmittedAction,
  IToggle,
} from './table.type';
import { Observable, map, of, tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDropList,
  CdkDrag,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { fadeInUp400ms, stagger40ms } from '../../animations';
import { ImageComponent } from '../image/image.component';

export type Avatars = { name?: string };

@Component({
  selector: 'ui-common-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [stagger40ms, fadeInUp400ms],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ImageComponent,
    AsyncPipe,
    TitleCasePipe,
    NgClass,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    CdkDropList,
    CdkDrag,
    MatCheckboxModule,
    ClipboardModule,
    MatSlideToggleModule,
    CdkDragPlaceholder,
    MatPaginatorModule,
    MatDividerModule,
    CdkTableModule,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgStyle,
  ],
})
export class TableComponent<T> implements OnInit {
  // injections
  // private _datasourceService = inject(TableService);
  private _formBuilder = inject(FormBuilder);

  // template //
  // note: DONT use any *ngIf when getting a ref with @ViewChild
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  sharedCssClasses =
    'uppercase cursor-grabbing bg-green-100 text-gray-400 text-sm font-semibold sticky';
  thColumnCss = `max-h-12 justify-start ${this.sharedCssClasses}`;
  tableCssClasses = {
    checkBox: {
      th: 'max-h-10 max-w-14 h-8 text-center p-0 bg-green-100',
      td: 'max-w-14 max-h-8 text-center p-0',
    },
    common: {
      th: `${this.thColumnCss}`,
    },
    shared: {
      th: `${this.sharedCssClasses}`,
    },
    image: {
      th: `max-w-12 pl-2 pr-2 ${this.sharedCssClasses}`,
    },
  };

  // inputs and outputs //
  // @Input()
  // data$!: Observable<T[]>;
  @Input()
  data$!: Observable<T[]>;
  @Input()
  columns!: IColumn<T>[];
  @Input()
  actions?: IAction[];
  @Input()
  separatedAction = true; // todo: change type if needed
  @Input()
  listName!: string;
  @Input()
  tableIcon!: string;
  // @Input()
  isSidebar = false;

  @Output()
  emittedAction = new EventEmitter<IEmittedAction<T>>();
  @Output()
  emittedToggling = new EventEmitter<IToggle<T>>();
  @Output()
  deleteMany = new EventEmitter<T[]>();

  // parameters //
  public selection = new SelectionModel<T>(true, []);
  public placeholder = '';
  public pageSize = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  // dataSource!: MatTableDataSource<T>;

  // search form //
  public searchForm!: FormGroup;
  public searchCtrl!: FormControl;

  public datasource!: MatTableDataSource<T>;

  // helpers //
  isChecked!: boolean;
  height = signal(30);
  public originalLength = 0;
  public onMediaChange$?: Observable<string[]>;
  temp?: T;

  // getters //
  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  // hooks //
  ngOnInit() {
    this._initForm();
    this._initMediaWatcher$();
    this._initHelpers();
    this.#initData();
  }

  private _initMediaWatcher$() {
    // todo
  }

  deleteRowSelected(rowsT: T[]) {
    this.deleteMany.emit(rowsT);
    this.selection.clear();
  }

  public toggleSelection(rowPatient: T) {
    this.selection.toggle(rowPatient);
    // this.onChangeCheckBox(undefined);
  }

  public toggleColumnVisibility(column: IColumn<T>, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  // if a column has type checkbox(toggle)
  // toggling
  public toggle(rowType: T, columnName: string, toggle: any) {
    this.emittedToggling.emit({
      rowType,
      checked: toggle.checked,
      columnName, // parent updates this specific column
    });
  }

  public chooseAction(actionName: IActionName, rowType?: T) {
    this.emittedAction.emit({
      actionName,
      type: rowType,
    });
  }

  public trackByProperty(index: number, column: IColumn<T>) {
    return column.property;
  }

  public trackByRow(index: number, row: any) {
    return row['toggle'];
  }

  /**
   * @description
   * Drag and drop doesn't work correctly inside a DATATABLE if:
   * Any column is invisible (columns array length changed)
   *  => So rows won't be dropped if table's columns are sortable or connected to paginator
   */
  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  increaseHeight() {
    this.height.update((value) => (value += 1));
  }

  decreaseHeight() {
    this.height.update((value) => (value -= 1));
  }

  // private methods //
  private _initForm() {
    this._initPlaceholder();
    this.searchCtrl = this._formBuilder.control('', []);
    this.searchForm = this._formBuilder.group({
      search: this.searchCtrl,
    });
  }

  private _initHelpers() {
    this.originalLength = this.visibleColumns.length;
  }

  private _initPlaceholder() {
    this.columns.forEach((column) => {
      if (column.type == 'text' || column.type == 'color')
        this.placeholder += `${column.label}, `;
    });
    this.placeholder = `Search by ${this.placeholder}`;
  }

  #initData() {
    this.data$
      .pipe(
        map((values) => {
          const datasource = new MatTableDataSource(values);
          datasource.paginator = this.paginator;
          datasource.sort = this.sort;
          this.datasource = datasource;
        }),
      )
      .subscribe();

    this.searchCtrl.valueChanges
      .pipe(
        map((value) => value.trim().toLowerCase()),
        tap((search) => (this.datasource.filter = search)),
      )
      .subscribe();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected?.length === this.datasource?.data?.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...(this.datasource?.data ?? []));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T & { position: number }): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row['position'] + 1
    }`;
  }
}
