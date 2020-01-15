declare global {
  interface ImportMeta {
    url: string;
  }
}

export type ImportMetaURL = ImportMeta['url'];
