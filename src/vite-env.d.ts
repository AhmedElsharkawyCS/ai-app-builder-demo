/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_NEWRELIC_QUERY_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}