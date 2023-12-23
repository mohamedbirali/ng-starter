import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { TContact } from '../../models/contact.model';
import { IAction, IColumn, TableComponent } from '@common/ui-common';
import { MatDialog } from '@angular/material/dialog';
import { ContactPopupFormComponent } from '../popup-form/popup-form.component';
import { FireStoreService } from '@firebase';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { HelperArrayService } from '@feature-common';

@Component({
  selector: 'feature-contact-table',
  templateUrl: './contact-table.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [TableComponent],
})
export class ContactTableComponent implements OnInit {
  contacts$!: Observable<any>; // todo: add types
  #_fireStoreService = inject(FireStoreService);
  public dialog = inject(MatDialog);

  isLoaded = false;

  // helpers
  #helperArrayService = new HelperArrayService();

  columns = [
    { property: 'select', label: 'select', type: 'checkbox', visible: true },
    { property: 'avatar', label: 'avatar', type: 'image', visible: true },
    { property: 'name', label: 'name', type: 'text', visible: true },
    { property: 'phone', label: 'phone', type: 'contact', visible: true },
    { property: 'contact', label: 'contact', type: 'text', visible: true },
    { property: 'color', label: 'color', type: 'color', visible: true },
    { property: 'toggle', label: 'toggle', type: 'toggle', visible: true },
    { property: 'action', label: 'action', type: 'button', visible: true },
  ] as IColumn<TContact>[];

  actions = [
    {
      name: 'edit',
      event: {
        label: 'Edit',
        icon: {
          name: 'edit',
          color: 'primary',
        },
      },
    },
    {
      name: 'delete',
      event: {
        label: 'Delete',
        icon: {
          name: 'delete',
          color: 'warn',
        },
      },
    },
  ] as IAction[];

  ngOnInit(): void {
    this.contacts$ = this.#_fireStoreService
      .queryCollection$('contacts', {
        fieldName: 'userId',
        operation: '==',
        value: localStorage.getItem('userId') ?? '',
      })
      .pipe(
        distinctUntilChanged((prev, curr) =>
          this.#helperArrayService.equals(prev, curr),
        ),
      );
  }

  handleAction(action: Record<string, any>) {
    if (action['actionName'] === 'delete') {
      this.#_fireStoreService.deleteDoc('contacts', action['type']['id']);
      return;
    }

    const dialogRef = this.dialog.open(ContactPopupFormComponent, {
      data: action,
    });

    dialogRef.afterClosed().subscribe();
  }

  toggle(event: Record<string, any>) {
    console.log(event);

    this.#_fireStoreService.setData(
      'contacts',
      { toggle: event['checked'] },
      event['rowType']['id'],
    );
  }

  deleteMany(event: Record<string, any>[]) {
    for (let i = 0; i < event.length; i++) {
      const element = event[i];
      this.#_fireStoreService.deleteDoc('contacts', element['id']);
    }
  }
}
