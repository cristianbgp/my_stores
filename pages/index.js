import { Suspense, useEffect, useState } from "react";
import Head from "next/head";
import StoresList from "../components/StoresList";
import Spinner from "../components/Spinner";

export default function Index() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => console.log("by @cristianbgp 🤓"), []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition(pos.coords);
    });
  }, [setPosition]);

  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-[#181818] transition-colors">
      <Head>
        <title>MY_STORES</title>
      </Head>
      <h1 className="mt-4 text-3xl font-extralight">MY_STORES</h1>
      {position.latitude === 0 ? (
        <div className="h-[80vh] w-fullfont-medium text-2xl flex justify-center items-center">
          <p style={{ fontSize: "0.8em" }}>Please allow location access</p>
        </div>
      ) : (
        <Suspense
          fallback={
            <div style={{ margin: "1em" }}>
              <Spinner />
            </div>
          }
        >
          <StoresList
            currentLocation={[position.latitude, position.longitude]}
          />
        </Suspense>
      )}
    </div>
  );
}
