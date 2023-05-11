import * as React from "react";
import { Link, graphql } from "gatsby";
import { Popup, MapContainer, TileLayer, Marker } from "react-leaflet";
import "../global.css";

const MapPage = ({ data }) => {
  return (
    <main className="map">
      <MapContainer center={[23.5, 28]} zoom={3}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.allOutsetaAccount.nodes.map((account, index) => (
          <Marker
            key={index}
            position={[
              account.fields?.coordinates?.lat,
              account.fields?.coordinates?.lng,
            ]}
          >
            <Popup>
              {account.city}, {account.state}, {account.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Link className="back" to="/">
        ← Back to the list
      </Link>
    </main>
  );
};

export const query = graphql`
  query {
    allOutsetaAccount {
      nodes {
        city
        country
        state
        fields {
          coordinates {
            lat
            lng
          }
        }
      }
    }
  }
`;

export default MapPage;
