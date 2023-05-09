import * as React from "react";
import { graphql } from "gatsby";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const IndexPage = ({ data }) => {
  return (
    <main>
      <header>
        <h1>Outseta Customers Mapped</h1>
      </header>
      <section>
        <ol>
          <li>Source the customers</li>
          <li>Make sure they show up in GraphiQL</li>
          <li>List the customers</li>
          <li>Add address to lat/lng step when sourcing</li>
          <li>Install React Leaflet</li>
          <li>Add customers to the map</li>
        </ol>
      </section>
      <MapContainer
        style={{ height: "100vh" }}
        center={[51.505, -0.09]}
        zoom={3}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.allOutsetaAccount.nodes.map((node) => {
          return (
            node.fields.location && (
              <Marker
                position={[
                  node.fields.location?.lat,
                  node.fields.location?.lng,
                ]}
              >
                <Popup>
                  {node.city}, {node.state}, {node.country}
                </Popup>
              </Marker>
            )
          );
        })}
      </MapContainer>
      <section>
        <ul>
          {data.allOutsetaAccount.nodes.map((node) => {
            return (
              <li>
                {node.city}, {node.state}, {node.country}
                <br />
                {node.fields.location?.lat}/{node.fields.location?.lat}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
};

export const query = graphql`
  query {
    allOutsetaAccount(filter: {}) {
      nodes {
        city
        country
        state
        fields {
          location {
            lat
            lng
          }
        }
      }
    }
  }
`;

export default IndexPage;
