import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FilesStore } from '../../store';
import {
  SearchComponent,
  ItemCardComponent,
  ProgressComponent,
} from '../../components';
import { BehaviorSubject, throttleTime } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    SearchComponent,
    ItemCardComponent,
    ProgressComponent,
    RouterLink,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
  store = inject(FilesStore);

  uploadingFiles = this.store.uploadingFiles;
  filteredFiles = this.store.filteredFiles;
  query = this.store.filter.query;
  loading = this.store.loading;

  private draggingOver = new BehaviorSubject<boolean>(false);
  draggingOver$ = this.draggingOver
    .asObservable()
    .pipe(throttleTime(10, undefined, { trailing: true }));

  constructor() {
    this.store.load();
  }

  @HostListener('dragover') onDragOver() {
    this.draggingOver.next(true);
  }

  @HostListener('dragleave') onDragLeave() {
    this.draggingOver.next(false);
  }

  uploadFile(event: Event) {
    this.draggingOver.next(false);

    const files = (event.target as HTMLInputElement)!.files!;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();

      const file = files[i];
      formData.append('file', file);

      this.store.upload(formData);
    }
  }
}
