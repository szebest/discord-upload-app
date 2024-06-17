import { Component, inject, input, signal } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FileResponseView } from '../../models';
import { FilesStore } from '../../store';
import { FilesApiService } from '../../api';
import { DownloadFileService } from '../../services';
import { ProgressComponent } from '../progress/progress.component';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [ProgressComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  store = inject(FilesStore);
  filesApi = inject(FilesApiService);
  downloadFileService = inject(DownloadFileService);

  file = input.required<FileResponseView>();

  progress = signal<number | null>(null);

  downloadFile(id: number) {
    this.filesApi.downloadFile(id).subscribe((response) => {
      if (response.type === HttpEventType.Response) {
        if (response.type === HttpEventType.Response) {
          const filename =
            response.headers.get('Content-Disposition') ?? 'file.txt';

          this.downloadFileService.download(
            new Blob([response.body!]),
            filename
          );

          this.progress.set(null);
        }
      } else if (response.type === HttpEventType.DownloadProgress) {
        const newProgress = Math.round(
          (100 * response.loaded) / response.total!
        );

        this.progress.set(newProgress);
      } else {
        this.progress.set(0);
      }
    });
  }

  deleteFile(id: number) {
    this.store.delete(id);
  }
}
