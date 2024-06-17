import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloadFileService {
  download(blob: Blob, filename?: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    document.body.appendChild(a);

    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename ?? 'file';
    a.click();

    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
