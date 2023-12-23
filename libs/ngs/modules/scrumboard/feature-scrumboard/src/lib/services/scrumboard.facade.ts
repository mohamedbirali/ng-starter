import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  take,
} from 'rxjs';
import {
  Board,
  Card,
  Label,
  List,
  ScrumboardService,
} from '@ngs/modules/data-access-scrumboard';
import { assign, cloneDeep } from 'lodash';
import { CARDS, LABELS } from '../constants/data';

@Injectable({ providedIn: 'root' })
export class ScrumboardFacade {
  // injections
  #_scrumboardService = inject(ScrumboardService);

  // Private
  #_board = new BehaviorSubject<Board | null>(null);
  #_card = new BehaviorSubject<Card | null>(null);

  // getters
  get board$(): Observable<Board | null> {
    return this.#_board.asObservable();
  }

  get card$(): Observable<Card | null> {
    return this.#_card.asObservable();
  }

  // done
  getBoards$(): Observable<Board[]> {
    return this.#_scrumboardService
      .getBoards$()
      .pipe(map((response) => response.map((item) => new Board(item))));
  }

  // done
  getBoard$(id: string): Observable<Board> {
    return combineLatest([
      this.#_scrumboardService.getBoard$(id),
      this.#_scrumboardService.getLists$(id),
      this.#_scrumboardService.getCards$(id),
    ]).pipe(
      map(([board, lists, cards]) => {
        board.lists = lists;

        board.lists.forEach((list, index, array: any) => {
          array[index].cards = cards
            .filter(
              (item: any) => item.boardId === id && item.listId === list.id,
            )
            .sort((a, b) => a.position - b.position);
        });
        return board;
      }),
    );
  }

  // second priority
  createBoard(board: Board) {
    return this.#_scrumboardService.createBoard(board);
  }

  // second priority
  async updateBoard(board: Board) {
    return await this.#_scrumboardService.updateBoard(board);
  }

  async deleteBoard(id: string) {
    return await this.#_scrumboardService.deleteBoard(id);
  }

  // done
  async createList(list: List) {
    return await this.#_scrumboardService.createList(list);
  }

  // done
  async updateList(list: List) {
    return await this.#_scrumboardService.updateList(list, list.id!);
  }

  // done
  async updateLists(lists: any) {
    await this.#_scrumboardService.updateLists(lists);
  }

  // done
  async deleteList(id: string) {
    // Find the list and delete it
    return await this.#_scrumboardService.deleteList(id);
  }

  // done
  getCard(id: string) {
    return this.#_scrumboardService.getCard$(id).pipe(
      take(1),
      map((card: any) => {
        // Find the card
        // const card = board.lists
        //   .find((list: any) => list.cards.some((item: any) => item.id === id!))!
        //   .cards.find((item: any) => item.id === id);

        // Update the card
        this.#_card.next(card!);

        // Return the card
        return card;
      }),
    );
  }

  // done
  async createCard(card: Card) {
    return await this.#_scrumboardService.createCard(card);
  }

  // done
  async updateCard(id: string, _card: Card) {
    return await this.#_scrumboardService.updateCard(id, _card);
  }

  // done
  updateCards(_cards: Card[]) {
    // Get the cards
    const cards = cloneDeep(_cards);

    // Prepare the updated cards
    const updatedCards: any = [];

    // Go through the cards
    cards.forEach((item: any) => {
      // Find the card
      const index = CARDS.findIndex((card) => item.id === card.id);

      // Go through the labels and leave only ids of them
      item.labels = item.labels.map((itemLabel: any) => itemLabel.id);

      // Update the card
      CARDS[index] = assign({}, CARDS[index], item);

      // Attach the labels of the card
      item.labels = item.labels.map((cardLabelId: any) =>
        LABELS.find((label) => label.id === cardLabelId),
      );

      // Store in the updated cards
      updatedCards.push(item);
    });

    // Get the board value
    const board = this.#_board.value!;

    // Go through the updated cards
    updatedCards.forEach((updatedCard: any) => {
      // Find the index of the updated card's list
      const listIndex = board.lists.findIndex(
        (list) => list.id === updatedCard.listId,
      );

      // Find the index of the updated card
      const cardIndex = board.lists[listIndex].cards.findIndex(
        (item) => item.id === updatedCard.id,
      );

      // Update the card
      board.lists[listIndex].cards[cardIndex] = updatedCard;

      // Sort the cards
      board.lists[listIndex].cards.sort((a, b) => a.position - b.position);
    });

    // Update the board
    this.#_board.next(board);
    return of(board);
  }

  deleteCard(id: string) {
    // Find the card and delete it
    return this.#_scrumboardService.deleteCard(id);
  }

  createLabel(label: Label) {
    return of();
  }

  updateLabel(id: string, label: Label) {
    return of();
  }

  deleteLabel(id: string) {
    return of();
  }

  search(query: string) {
    return of();
  }
}
