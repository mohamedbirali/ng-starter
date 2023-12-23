import { HelperDateService } from '@feature-common';
import { DateTime } from 'luxon';
import { Injectable, inject, signal } from '@angular/core';
import { FireAuthService, FireStoreService } from '@firebase';
import { Board, Card, Label, List } from '../models/scrumboard.model';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { orderBy } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ScrumboardService {
  #_fireStoreService = inject(FireStoreService);
  #_user = signal<User | null>(null);
  #user = inject(FireAuthService)
    .user$()
    .subscribe((u) => {
      this.#_user.set(u);
    });
  #boards = 'boards';
  #boardLists = 'boardLists';
  #boardCards = 'boardCards';
  #boardMemebers = 'boardMembers';
  #boardLabels = 'boardLabels';
  #boardCardLabels = 'boardCardLabels';
  #boardCardAttachements = 'boardCardAttachements';

  async createBoard(board: Board) {
    await this.#_fireStoreService.addDoc(this.#boards, {
      ...board,
      userId: this.#_user()?.uid,
      members: [
        {
          id: this.#_user()?.uid,
          avatar: this.#_user()?.photoURL,
          name: this.#_user()?.displayName,
        },
      ],
      icon: 'dashboard',
      lastActivity: DateTime.now().startOf('day').minus({ day: 1 }).toISO(),
    } as Board);
  }

  getBoards$(): Observable<Board[]> {
    return this.#_fireStoreService.queryCollection$(this.#boards, {
      fieldName: 'userId',
      operation: '==',
      value: localStorage.getItem('userId') ?? '',
    }) as Observable<Board[]>;
  }

  getLists$(boardId: string): Observable<List[]> {
    return this.#_fireStoreService.queryCollection$(
      this.#boardLists,
      {
        fieldName: 'boardId',
        operation: '==',
        value: boardId,
      },
      orderBy('position'),
    ) as Observable<List[]>;
  }

  getCards$(boardId: string): Observable<List[]> {
    return this.#_fireStoreService.queryCollection$(
      this.#boardCards,
      {
        fieldName: 'boardId',
        operation: '==',
        value: boardId,
      },
      orderBy('position'),
    ) as Observable<List[]>;
  }

  getBoard$(id: string): Observable<Board> {
    return this.#_fireStoreService.getDoc$(
      `${this.#boards}`,
      id,
    ) as Observable<Board>;
  }

  async updateBoard(board: Board) {
    await this.#_fireStoreService.updateDoc(
      `${this.#boards}`,
      board,
      board.id!,
    );
  }

  async deleteBoard(id: string) {
    return await this.#_fireStoreService.deleteDoc(`${this.#boards}`, id);
  }

  async createList(list: List) {
    return await this.#_fireStoreService.addDoc(this.#boardLists, list);
  }

  async updateList(list: List, id: string) {
    return await this.#_fireStoreService.updateDoc(
      this.#boardLists,
      { title: list.title, position: list.position },
      id,
    );
  }

  async updateLists(lists: any) {
    try {
      return await Promise.all([
        this.#_fireStoreService.setData(
          this.#boardLists,
          { position: lists.curr.replacePositionWith },
          lists.curr.id,
        ),
        this.#_fireStoreService.setData(
          this.#boardLists,
          { position: lists.prev.replacePositionWith },
          lists.prev.id,
        ),
      ]);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteList(id: string) {
    return await this.#_fireStoreService.deleteDoc(`${this.#boardLists}`, id);
  }

  getCard$(id: string) {
    return this.#_fireStoreService.getDoc$(`${this.#boardCards}`, id);
  }

  async createCard(card: Card) {
    return await this.#_fireStoreService.addDoc(this.#boardCards, card);
  }

  async updateCard(id: string, card: Card) {
    card.dueDate = card?.dueDate
      ? new HelperDateService().format((card.dueDate as any).ts)
      : null;
    return await this.#_fireStoreService.setData(this.#boardCards, card, id);
  }

  // todo
  // updateCards(_cards: Card[]) {}

  deleteCard(id: string) {
    this.#_fireStoreService.deleteDoc(`${this.#boardCards}`, id);
  }

  // todo:
  // create labels in the board level (in the setting section)
  createLabel(label: Label) {
    this.#_fireStoreService.addDoc(this.#boardLabels, label);
  }

  updateLabel(id: string, label: Label) {
    this.#_fireStoreService.addDoc(`${this.#boardCardLabels}/${id}`, label);
  }

  deleteLabel(id: string) {
    this.#_fireStoreService.deleteDoc(`${this.#boardCardLabels}`, id);
  }

  // search(query: string) {}
}
