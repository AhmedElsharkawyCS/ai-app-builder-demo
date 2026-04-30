import axios from 'axios';

const MONGO_BASE_URL = import.meta.env.VITE_MONGO_BASE_URL;

export async function queryMongo<T>(collection: string, pipeline: object[]): Promise<T[]> {
  const { data } = await axios.post<T[] | null>(`${MONGO_BASE_URL}/api/mongo/query`, { collection, pipeline });
  return data ?? [];
}
