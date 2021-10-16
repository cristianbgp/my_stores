export const apiURL = "/api";

export default async function fetcher(path) {
  const response = await fetch(`${apiURL}/${path}`);
  if (!response.ok) throw new Error("Algo salió mal");
  return response.json();
}
