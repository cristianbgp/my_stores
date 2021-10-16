import Link from "next/link";
import { Text, Card, Line, MapPin } from "./Ui";

function getTextColor(owner) {
  switch (owner) {
    case "tambo": {
      return "bg-tambo";
    }
    case "oxxo": {
      return "bg-oxxo";
    }
    case "listo": {
      return "bg-listo";
    }
    default: {
      return "bg-gray-900";
    }
  }
}

function StoreCard({ store }) {
  return (
    <Card
      className="transition-transform hover:scale-105 m-4"
      styles={{ width: "initial" }}
    >
      <div className="flex justify-between mb-1">
        <Text styles={{ fontWeight: "bold", padding: 0 }}>{store.name}</Text>
        <span
          className={`${getTextColor(
            store.owner
          )} flex items-center px-2 rounded-xl`}
        >
          {store.owner}
        </span>
      </div>
      <Line />
      <div className="flex justify-between">
        <div>
          <Text>
            {store.distance < 1000
              ? `${parseInt(store.distance)}m`
              : `${(store.distance / 1000).toFixed(2)}km`}
          </Text>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={store.gmapLink}
            className="hover:underline text-[#181818]"
          >
            {store.address}
          </a>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <a target="_blank" rel="noopener noreferrer" href={store.gmapLink}>
            <MapPin className="w-16 h-16" style={{ fill: "#181818" }} />
          </a>
        </div>
      </div>
    </Card>
  );
}

export default StoreCard;
