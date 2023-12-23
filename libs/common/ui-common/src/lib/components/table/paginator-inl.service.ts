import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

/**
 * Translate table pagination to french
 */
export class PaginatorFrench implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = /**$localize */ `Première page`;
  itemsPerPageLabel = /**$localize */ `Élément(s) par page:`;
  lastPageLabel = /**$localize */ `Dernière page`;

  nextPageLabel = 'Page suivante';
  previousPageLabel = 'Page précedente';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return /**$localize */ `Page 1 sur 1`; // toReview
    }
    if (pageSize >= length)
      return /**$localize */ `${1}-${length} sur ${length}`;
    const firstElementIndex = page * pageSize + 1;
    const lastElementIndex = (page + 1) * pageSize;
    return /**$localize */ `${firstElementIndex}-${
      lastElementIndex > length ? length : lastElementIndex
    } sur ${length}`;
  }
}
