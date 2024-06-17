import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FilesStore } from '../store';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  store = inject(FilesStore);
  router = inject(Router);
  route = inject(ActivatedRoute);

  filter = this.store.filter;

  constructor() {
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(),
        tap((params) => {
          const searchQuery = (params as { q: string | null }).q;

          if (searchQuery === null) {
            return;
          }

          this.store.search(searchQuery);
        })
      )
      .subscribe();
  }

  search(searchText: string) {
    this.store.search(searchText);

    this.router.navigate([''], {
      queryParams: { q: searchText.length !== 0 ? searchText : null },
      replaceUrl: true,
      queryParamsHandling: 'merge',
    });
  }
}
