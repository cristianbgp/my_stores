export default function distance(loc1, loc2) {
  const rad_per_deg = Math.PI / 180; // PI / 180
  const rkm = 6371; // Earth radius in kilometers
  const rm = rkm * 1000; // Radius in meters

  const dlat_rad = (loc2[0] - loc1[0]) * rad_per_deg; // Delta, converted to rad
  const dlon_rad = (loc2[1] - loc1[1]) * rad_per_deg;

  const [lat1_rad, _lon1_rad] = loc1.map((i) => i * rad_per_deg);
  const [lat2_rad, _lon2_rad] = loc2.map((i) => i * rad_per_deg);

  const a =
    Math.sin(dlat_rad / 2) ** 2 +
    Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon_rad / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return rm * c; // Delta in meters
}
