import distance from "../../utils/distance";

const listoDptos = [15, 7, 20, 13];

export default async (req, res) => {
  const { currentLatitude, currentLongitude } = req.query;
  const currentLocation = [currentLatitude, currentLongitude];

  try {
    const responseData = await Promise.all(
      listoDptos.map(async (iddpto) => {
        const dptoResponse = await fetch(
          `https://www.primax.com.pe/json.locales.php?iddpto=${iddpto}&services=4`
        );
        return dptoResponse.json();
      })
    );
    const result = responseData.flat().map((store) => ({
      id: `listo-${store.id}`,
      name: store.nombre,
      address: store.direccion,
      gmapLink: `https://www.google.com/maps/place/${encodeURIComponent(
        store.direccion
      )}/@${store.lat},${store.lon},18.87z`,
      coords: { latitude: store.lat, longitude: store.lon },
      distance: distance([store.lat, store.lon], currentLocation),
      owner: "listo",
    }));

    res.statusCode = 200;
    res.json({
      data: Object.values(result).sort((a, b) => a.distance - b.distance),
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ data: { error: err.message } });
  }
};
