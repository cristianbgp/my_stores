export default function getCoordsFromUrl(mapUrl) {
  const url = mapUrl.split("@");
  const at = url[1].split("z");
  const zero = at[0].split(",");
  const latitude = zero[0];
  const longitude = zero[1];
  return { latitude, longitude };
}
