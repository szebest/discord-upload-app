import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseApiService } from '@core';

import { environment } from '@environments/environment';

import { FileListResponse, FileResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FilesApiService extends BaseApiService {
  private filesApiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  getFiles(): Observable<FileListResponse> {
    return this.http.get<FileListResponse>(this.filesApiUrl, {
      headers: this.getHeaders(),
    });
  }

  downloadFile(id: number): Observable<HttpEvent<ArrayBuffer>> {
    return this.http.request(
      new HttpRequest('GET', `${this.filesApiUrl}/download/${id}`, {
        headers: this.getHeaders({ Accept: 'text/html' }),
        responseType: 'arraybuffer',
        reportProgress: true,
      })
    );
  }

  uploadFile(model: FormData): Observable<HttpEvent<FileResponse>> {
    return this.http.request(
      new HttpRequest('POST', `${this.filesApiUrl}/upload`, model, {
        reportProgress: true,
      })
    );
  }

  deleteFile(id: number) {
    return this.http.delete(`${this.filesApiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
