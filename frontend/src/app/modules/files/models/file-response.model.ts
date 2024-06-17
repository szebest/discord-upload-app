import { FileChunk } from './file-chunk.model';

export type FileResponse = {
  id: number;
  name: string;
  totalSize: number;
  uploadedAt: string;
  fileChunks: FileChunk[];
};

export type FileResponseView = FileResponse & {
  loading: boolean;
};

export type FileListResponse = FileResponse[];

export type FileListResponseView = FileResponseView[];
