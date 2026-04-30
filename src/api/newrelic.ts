import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TAPSTERS_MW_BASE_URL;

export async function queryNewRelic<T>(nrql: string): Promise<T[]> {
  const { data } = await axios.post<T[] | null>(`${BASE_URL}/api/newrelic/query`, { query: nrql });
  return data ?? [];
}