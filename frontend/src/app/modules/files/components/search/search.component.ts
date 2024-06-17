import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SearchService } from '../../services';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  searchService = inject(SearchService);

  searchForm = new FormGroup({
    searchText: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      this.searchForm.patchValue({
        searchText: this.searchService.filter().query,
      });
    });
  }

  search() {
    const searchText = this.searchForm.getRawValue().searchText;

    if (searchText === undefined) return;

    this.searchService.search(searchText);
  }
}
