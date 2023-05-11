import * as React from "react";
import { graphql, Link } from "gatsby";
import "../global.css";

const IndexPage = ({ data }) => {
  return (
    <main className="home">
      <header>
        <h1>Outseta Customers Mapped</h1>
      </header>
      <h2>The What & Why</h2>
      <p>
        Visualize Outseta's customer on the map to better understand where in
        the world we got traction, but mostly for fun 🥳
      </p>
      <h2>The How</h2>
      <section>
        <ol>
          <li>✅ Source the accounts as nodes</li>
          <li>✅ Make sure they show up in GraphiQL</li>
          <li>
            ✅ List the accounts using code from the GraphiQL code exporter
          </li>
          <li>✅ Add coordinates to nodes with Google Geocoding API </li>
          <li>✅ Display the coordinates in the from step 3</li>
          <li>✅ Install React Leaflet and copy getting started example</li>
          <li>✅ Add each account as a marker on the map</li>
        </ol>
      </section>
      <section>
        <p>
          <Link to="/map">See the map →</Link>
        </p>
      </section>
      <h2>The List</h2>
      <section>
        <ul>
          {data.allOutsetaAccount.nodes.map((account, index) => (
            <li key={index}>
              {account.city}, {account.state}, {account.country}
              <br />
              {account.fields?.coordinates?.lat} /{" "}
              {account.fields?.coordinates?.lng}
            </li>
          ))}
        </ul>
      </section>
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

export default IndexPage;
