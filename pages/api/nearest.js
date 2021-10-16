const BASE_URL = "http://localhost:3000";

const urls = ["/api/tambo", "/api/oxxo", "/api/listo"];

export default async (req, res) => {
  const { currentLatitude, currentLongitude } = req.query;

  try {
    const responseData = await Promise.all(
      urls.map(async (url) => {
        const urlResponse = await fetch(
          `${process.env.BASE_URL}${url}?currentLatitude=${currentLatitude}&currentLongitude=${currentLongitude}`
        );
        return urlResponse.json();
      })
    );

    const result = responseData.map((d) => d.data).flat();

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
