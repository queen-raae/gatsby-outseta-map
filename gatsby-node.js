const axios = require("axios");

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

      if (Address?.City || Address?.State || Address?.Country) {
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
    }

    page += 1;
    more = accounts.length > 0;
  } while (more);
};
