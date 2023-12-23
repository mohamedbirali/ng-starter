import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ScrumboardFacade } from '../../../services/scrumboard.facade';
import { Board } from '@ngs/modules/data-access-scrumboard';

@Component({
  selector: 'feature-scrumboard-boards',
  templateUrl: './add-board.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    NgClass,
    MatDialogModule,
  ],
})
export class AddBoardComponent {
  matDialogRef = inject(MatDialogRef<AddBoardComponent>);
  #_scrumboardFacade = inject(ScrumboardFacade);

  boardForm = inject(FormBuilder).group({
    // id: [''],
    title: ['', Validators.required],
    description: [''],
  });

  createBoard() {
    this.#_scrumboardFacade.createBoard(this.boardForm.value as Board);
  }
}
