import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions() {
  let options;
  if (process.env.NODE_ENV !== "production") {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }
  return options;
}

const fixedStores = [
  {
    id: "1",
    name: "JCHAVEZ-VES",
    address: "Grupo 4 Mz. F, Lt. 18 Sec. 02 – Villa El Salvador",
    gmapLink:
      "https://www.google.com/maps/search/Grupo+4+Mz.+F,+Lt.+18+Sec.+02+%E2%80%93+Villa+El+Salvador/@-12.2241777,-76.9832071,12.09z",
  },
  {
    id: "322",
    name: "VENEZUELA-C9",
    address: "Av. Venezuela 947 – Breña",
    gmapLink:
      "https://www.google.com/maps/place/Av.+Rep%C3%BAblica+de+Venezuela+947,+Bre%C3%B1a+15082/@-12.0550119,-77.049282,17z/data=!3m1!4b1!4m5!3m4!1s0x9105c8dafb2d368b:0x124afe2e00e8ae9f!8m2!3d-12.0550119!4d-77.0470933",
  },
  {
    id: "401",
    name: "VENEZUELA-C11",
    address: "Av. República de Venezuela 1199 – Breña",
    gmapLink:
      "https://www.google.com/maps/place/Av.+Rep%C3%BAblica+de+Venezuela+1199,+Bre%C3%B1a+15082/@-12.055113,-77.0533117,17z/data=!3m1!4b1!4m5!3m4!1s0x9105c8d985cc63f5:0x4cbc36cfecee01cb!8m2!3d-12.055113!4d-77.051123",
  },
  {
    id: "430",
    name: "LAS PALMAS",
    address: "Av. Aviación 104 – Barranco",
    gmapLink:
      "https://www.google.com/maps/place/Av.+Aviaci%C3%B3n+104,+Barranco+15018/@-12.0612719,-77.0153257,17z/data=!3m1!4b1!4m5!3m4!1s0x9105c9462f120e6f:0x9d5ee749c957825f!8m2!3d-12.0612719!4d-77.013137",
  },
  {
    id: "460",
    name: "ALMENDRAS-C3",
    address: "Av. Las Almendras 300 – Independencia",
    gmapLink:
      "https://www.google.com/maps/place/Av.+las+Almendras+300,+Independencia+15311/@-11.9856882,-77.0631881,17z/data=!3m1!4b1!4m5!3m4!1s0x9105ce4df24e7fb7:0xb85d57ef80e8aa87!8m2!3d-11.9856882!4d-77.0609994",
  },
];

export default async (req, res) => {
  const { currentLatitude, currentLongitude } = req.query;
  const currentLocation = [currentLatitude, currentLongitude];

  try {
    const options = await getOptions();
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto("https://www.tambo.pe/institucional/tiendas");

    const result = await page.evaluate(
      (currentLocation, fixedStores) => {
        function getCoordsFromUrl(mapUrl) {
          const url = mapUrl.split("@");
          const at = url[1].split("z");
          const zero = at[0].split(",");
          const latitude = zero[0];
          const longitude = zero[1];
          return { latitude, longitude };
        }

        function distance(loc1, loc2) {
          const rad_per_deg = Math.PI / 180; // PI / 180
          const rkm = 6371; // Earth radius in kilometers
          const rm = rkm * 1000; // Radius in meters

          const dlat_rad = (loc2[0] - loc1[0]) * rad_per_deg; // Delta, converted to rad
          const dlon_rad = (loc2[1] - loc1[1]) * rad_per_deg;

          const [lat1_rad, _lon1_rad] = loc1.map((i) => i * rad_per_deg);
          const [lat2_rad, _lon2_rad] = loc2.map((i) => i * rad_per_deg);

          const a =
            Math.sin(dlat_rad / 2) ** 2 +
            Math.cos(lat1_rad) *
              Math.cos(lat2_rad) *
              Math.sin(dlon_rad / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return rm * c; // Delta in meters
        }

        const list = document.querySelectorAll(
          "[class^=styles__FaqAnswerContainer]"
        );
        const data = {};

        [...list].forEach((group) => {
          const district = group.firstElementChild.children;

          [...district].forEach((element, index) => {
            if (element.classList.contains("id-tienda")) {
              const id = element.innerText.trim();

              // Sometimes link is on another div
              let gmapLink;
              if (district[index + 4].firstElementChild !== null) {
                gmapLink = district[index + 4].firstElementChild.href;
              } else {
                gmapLink = district[index + 5].firstElementChild.href;
              }

              // Fixing gmapLink on some stores
              if (fixedStores.map((store) => store.id).includes(id)) {
                gmapLink = fixedStores.find((store) => store.id).gmapLink;
              }
              const obj = {
                id: `tambo-${id}`,
                name: district[index + 1].innerText,
                address:
                  // Sometimes address is on another div
                  district[index + 2].innerText.length > 6
                    ? district[index + 2].innerText
                    : district[index + 3].innerText,
                gmapLink,
                coords: getCoordsFromUrl(gmapLink),
                distance: distance(
                  [
                    getCoordsFromUrl(gmapLink).latitude,
                    getCoordsFromUrl(gmapLink).longitude,
                  ],
                  currentLocation
                ),
                owner: "tambo",
              };
              data[id] = obj;
            }
          });
        });
        return data;
      },
      currentLocation,
      fixedStores
    );
    browser.close();
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
