require("dotenv").config();
const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
module.exports = {
  images: {
    domains: [
      "ipfs.moralis.io",
      "ipfs.io",
      "cdn.discordapp.com",
      "firebasestorage.googleapis.com",
      process.env.MORALIS_URL
  ? process.env.MORALIS_URL.replace("https://", "").split(":")[0]
  : "localhost",

    ],
  },
  env: {
    //Moralis Config
    APP_ID: process.env.APP_ID,
    MORALIS_URL: process.env.MORALIS_URL,

    //App configuration
    APP_ENV: process.env.APP_ENV,
    RECAPTCHA: process.env.RECAPTCHA,
    CLOUDINARY_KEY : process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET : process.env.CLOUDINARY_SECRET,
    CLOUDINARY_NAME : process.env.CLOUDINARY_NAME,


    //Network Config
    TEST_NETWORK_ID: 80001, //change it to 1337 to work with Ganache.
    MAINNET_ID: 137,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
