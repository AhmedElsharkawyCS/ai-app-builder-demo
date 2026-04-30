/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TAPSTERS_MW_BASE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}