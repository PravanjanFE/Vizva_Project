require("dotenv").config();

//module.exports = nextConfig

module.exports = {
  extends: [
    //...
    "plugin:@next/next/recommended",
  ],
  reactStrictMode: true,
  images: {
    domains: [
      "source.unsplash.com",
      "ipfs.moralis.io",
      "ipfs.io",
      process.env.MORALIS_URL.replace("https://", "").split(":")[0],
    ],
  },
  env: {
    //Moralis Config
    APP_ID: process.env.APP_ID,
    MORALIS_URL: process.env.MORALIS_URL,
    APP_ENV: process.env.APP_ENV,
    SPEEDY_NODE: process.env.SPEEDY_NODE,
    //Network Config
    DEV_NETWORK_ID: 80001, //change it to 1337 to work with Ganache.
    MAINNET_ID: 137,
  },
  webpack(config) {
    config.infrastructureLogging = { debug: /FileSystemInfo/ };
    return config;
  },
};
