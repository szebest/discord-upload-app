import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { Subject, firstValueFrom, takeUntil, tap } from 'rxjs';

import { FilesApiService } from '../api';
import { FileListResponseView } from '../models';
import { HttpEventType } from '@angular/common/http';

let id = 0;

type FilesState = {
  data: FileListResponseView;
  loading: boolean;
  uploadingFiles: { localId: number; progress: number; file: File }[];
  filter: {
    query: string;
  };
};

const initialState: FilesState = {
  data: [],
  loading: false,
  uploadingFiles: [],
  filter: { query: '' },
};

export const FilesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ data, filter: { query } }) => ({
    filteredFiles: computed(() =>
      data().filter((x) =>
        x.name.toLowerCase().includes(query()?.toLowerCase() ?? '')
      )
    ),
  })),
  withMethods((store, filesApi = inject(FilesApiService)) => ({
    async load() {
      if (store.data.length > 0) return;

      patchState(store, { loading: true });

      const data = await firstValueFrom(filesApi.getFiles());

      patchState(store, {
        data: data.map((x) => ({ ...x, loading: false })),
        loading: false,
      });
    },
    upload(model: FormData) {
      const file = model.get('file') as File;

      const localId = id++;

      patchState(store, {
        uploadingFiles: [
          ...store.uploadingFiles(),
          { localId, progress: 0, file },
        ],
      });

      const destroy$ = new Subject<void>();

      filesApi
        .uploadFile(model)
        .pipe(
          takeUntil(destroy$),
          tap((response) => {
            console.log(response);
            if (response.type === HttpEventType.Response) {
              patchState(store, {
                data: [...store.data(), { ...response.body!, loading: false }],
                uploadingFiles: store
                  .uploadingFiles()
                  .filter((x) => x.localId !== localId),
              });

              destroy$.next();
            } else if (response.type === HttpEventType.UploadProgress) {
              const progress = Math.round(
                (100 * response.loaded) / response.total!
              );

              patchState(store, {
                uploadingFiles: store.uploadingFiles().map((x) => {
                  if (x.localId !== localId) {
                    return x;
                  }

                  return {
                    ...x,
                    progress,
                  };
                }),
              });
            }
          })
        )
        .subscribe();
    },
    async delete(id: number) {
      patchState(store, {
        data: store.data().map((x) => {
          if (x.id !== id) {
            return x;
          }

          return { ...x, loading: true };
        }),
      });

      await firstValueFrom(filesApi.deleteFile(id));

      patchState(store, {
        data: store.data().filter((x) => x.id !== id),
      });
    },
    search(query: string) {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
  }))
);
