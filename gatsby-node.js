const axios = require("axios");
const { Client } = require("@googlemaps/google-maps-services-js");

// Axios Config
axios.defaults.baseURL = `https://${process.env.OUTSETA_ID}.outseta.com/api/v1/`;
axios.defaults.headers.common[
  "Authorization"
] = `Outseta ${process.env.OUTSETA_KEY}:${process.env.OUTSETA_SECRET}`;

const getAccounts = async ({ page }) => {
  const { data } = await axios.get("/crm/accounts", {
    params: {
      limit: 25,
      AccountStage: 3,
      offset: page,
      fields:
        "Uid,MailingAddress.City,MailingAddress.Country,MailingAddress.State,BillingAddress.City,BillingAddress.Country,BillingAddress.State",
    },
  });

  return data.items;
};

exports.sourceNodes = async (gatsbyUtils) => {
  const { actions, createNodeId, createContentDigest } = gatsbyUtils;
  const { createNode } = actions;

  let page = 0;
  let more = false;

  do {
    const accounts = await getAccounts({ page });

    gatsbyUtils.reporter.info(
      `Fetched Outseta Accounts >>> ${accounts.length} with offset ${page}`
    );

    for (const account of accounts) {
      let Address = account.MailingAddress;
      if (!account.MailingAddress?.Country) {
        Address = account.BillingAddress;
      }

      const invalidStates = ["Outside the US or Canada", "Not Applicable"];

      if (Address?.City || Address?.State || Address?.Country) {
        createNode({
          id: createNodeId(`outseta-account-${account.Uid}`),
          internal: {
            type: "OutsetaAccount",
            content: JSON.stringify(account),
            contentDigest: createContentDigest(account),
          },
          city: Address?.City,
          state: invalidStates.includes(Address?.State) ? null : Address?.State,
          country: Address?.Country,
        });
      }
    }

    page += 1;
    more = accounts.length > 0;
  } while (more);
};

const getCoordinates = async ({ city, state, country }) => {
  const client = new Client({});

  const { data } = await client.geocode({
    params: {
      address: `${city}, ${state}, ${country}`,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  if (data.status === "OK") {
    return data.results[0].geometry.location;
  }
};

exports.onCreateNode = async (gatsbyUtils) => {
  const { node, actions, reporter } = gatsbyUtils;
  const { createNodeField } = actions;

  if (node.internal.type === "OutsetaAccount") {
    const coordinates = await getCoordinates(node);

    if (coordinates) {
      reporter.info(
        `Adding location to OutsetaAccount ${coordinates.lat}, ${coordinates.lng}`
      );
      createNodeField({
        node,
        name: "coordinates",
        value: coordinates,
      });
    }
  }
};
