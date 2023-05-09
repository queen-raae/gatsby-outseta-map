const axios = require("axios");
const { Client } = require("@googlemaps/google-maps-services-js");

// Axios Config
axios.defaults.baseURL = "https://go.outseta.com/api/v1/";
axios.defaults.headers.common[
  "Authorization"
] = `Outseta ${process.env.OUTSETA_KEY}:${process.env.OUTSETA_SECRET}`;

// Google Config
const client = new Client({});

const getActiveAccounts = async ({ page }) => {
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

const getLatLng = async ({ city, state, country }) => {
  try {
    const address = `${city}, ${state}, ${country}`;
    const { data } = await client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    return data.results[0].geometry.location;
  } catch (error) {
    return null;
  }
};

exports.onCreateNode = async (gatsbyUtils) => {
  const { node, actions, reporter } = gatsbyUtils;
  const { createNodeField } = actions;

  if (node.internal.type === `OutsetaAccount`) {
    const location = await getLatLng(node);

    createNodeField({
      node,
      name: `location`,
      value: location,
    });

    reporter.info(
      `Created Location ${location?.lat}/${location?.lng} for ${node.id}`
    );
  }
};

exports.sourceNodes = async (gatsbyUtils) => {
  const { actions, createNodeId, createContentDigest } = gatsbyUtils;
  const { createNode } = actions;

  let page = 0;
  let more = false;

  do {
    const accounts = await getActiveAccounts({ page });

    gatsbyUtils.reporter.info(
      `Fetched Outseta Accounts >>> ${accounts.length} with offset ${page}`
    );

    for (const account of accounts) {
      let Address = account.MailingAddress;
      if (!account.MailingAddress?.Country) {
        Address = account.BillingAddress;
      }

      createNode({
        id: createNodeId(`outseta-account-${account.Uid}`),
        internal: {
          type: "OutsetaAccount",
          content: JSON.stringify(account),
          contentDigest: createContentDigest(account),
        },
        city: Address?.City,
        state: Address?.State,
        country: Address?.Country,
      });
    }

    page += 1;
    more = accounts.length > 0;
  } while (more);
};
