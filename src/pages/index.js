import * as React from "react";
import "../global.css";

const IndexPage = () => {
  return (
    <main>
      <header>
        <h1>Outseta Customers Mapped</h1>
      </header>
      <h2>The What & Why</h2>
      <p>
        Visualize Outseta's customer on the map to better understand where in
        the world we got traction.
      </p>
      <h2>The How</h2>
      <section>
        <ol>
          <li>✅ Source the customers</li>
          <li>◻️ Make sure they show up in GraphiQL</li>
          <li>◻️ List the customers</li>
          <li>◻️ Add address to lat/lng step when sourcing</li>
          <li>◻️ Install React Leaflet</li>
          <li>◻️ Add customers to the map</li>
        </ol>
      </section>
    </main>
  );
};

export default IndexPage;
