const API_URL = import.meta.env.VITE_API_NEWRELIC_QUERY_URL;

export async function queryNewRelic<T>(nrql: string): Promise<T[]> {
  const res = await fetch(`${API_URL}/api/newrelic/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: nrql }),
  });
  if (!res.ok) throw new Error(`NewRelic query failed: ${res.statusText}`);
  const data: T[] | null = await res.json();
  return data ?? [];
}