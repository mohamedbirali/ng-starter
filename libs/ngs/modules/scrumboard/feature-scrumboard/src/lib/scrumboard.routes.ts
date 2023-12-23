import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { catchError, Observable, take, throwError } from 'rxjs';
import { ScrumboardBoardComponent } from './components/board/board.component';
import { ScrumboardBoardsComponent } from './components/boards/boards.component';
import { ScrumboardCardComponent } from './components/card/card.component';
import { Board } from '@ngs/modules/data-access-scrumboard';
import { ScrumboardFacade } from './services/scrumboard.facade';

/**
 * Board resolver
 *
 * @param route
 * @param state
 */
const boardResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<Board> => {
  const scrumboardService = inject(ScrumboardFacade);
  const router = inject(Router);

  return scrumboardService.getBoard$(route.paramMap.get('boardId') ?? '').pipe(
    // Error here means the requested board is not available
    take(1),
    catchError((error) => {
      // Log the error
      console.error(error);

      // Get the parent url
      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(() => error);
    }),
  );
};

/**
 * Card resolver
 *
 * @param route
 * @param state
 */
const cardResolver = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const scrumboardService = inject(ScrumboardFacade);
  const router = inject(Router);

  return scrumboardService.getCard(route.paramMap.get('cardId') ?? '').pipe(
    // Error here means the requested card is not available
    catchError((error) => {
      // Log the error
      console.error(error);

      // Get the parent url
      const parentUrl = state.url.split('/').slice(0, -1).join('/');

      // Navigate to there
      router.navigateByUrl(parentUrl);

      // Throw an error
      return throwError(error);
    }),
  );
};

export const SCRUMBOARD_ROUTES: Routes = [
  {
    path: '',
    component: ScrumboardBoardsComponent,
    // resolve: {
    //   boards: () => inject(ScrumboardFacade).getBoards$().pipe(take(1)),
    // },
  },
  {
    path: ':boardId',
    component: ScrumboardBoardComponent,
    // resolve: {
    //   board: boardResolver,
    // },
    children: [
      {
        path: 'card/:cardId',
        component: ScrumboardCardComponent,
        // resolve: {
        //   card: cardResolver,
        // },
      },
    ],
  },
];
