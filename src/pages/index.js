import * as React from "react";
import { graphql } from "gatsby";

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
      <section>
        <ul>
          {data.allOutsetaAccount.nodes.map((node) => {
            return (
              <li>
                {node.city}, {node.state}, {node.country}
                <br />
                {node.fields.location?.lat}/{node.fields.location?.lng}
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
