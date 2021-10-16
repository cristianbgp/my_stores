import distance from "../../utils/distance";

const removedStores = [37];

export default async (req, res) => {
  const { currentLatitude, currentLongitude } = req.query;
  const currentLocation = [currentLatitude, currentLongitude];

  try {
    const response = await fetch(
      `https://www.oxxo.pe/api/get-tiendas?estado=Lima&latitude=${currentLatitude}&longitude=${currentLongitude}`,
      { headers: { "X-Requested-With": "XMLHttpRequest" } }
    );
    const data = await response.json();

    const result = data
      .filter((store) => !removedStores.includes(store.id))
      .map((store) => ({
        id: `oxxo-${store.id}`,
        name: store.calle,
        address: `${store.calle} ${store.numero}`,
        gmapLink: `https://www.google.com/maps/place/${encodeURIComponent(
          store.calle + " " + store.numero
        )}/@${store.latitud},${store.longitud},18.87z`,
        coords: { latitude: store.latitud, longitude: store.longitud },
        distance: distance([store.latitud, store.longitud], currentLocation),
        owner: "oxxo",
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
