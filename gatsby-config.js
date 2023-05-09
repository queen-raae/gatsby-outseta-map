require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  plugins: [
    {
      resolve: "@raae/gatsby-plugin-svg-emoji-favicon",
      options: {
        emoji: "🌐",
      },
    },
    {
      resolve: "gatsby-plugin-react-leaflet",
      options: {
        linkStyles: true,
      },
    },
  ],
};
