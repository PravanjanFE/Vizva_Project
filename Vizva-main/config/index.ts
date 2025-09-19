import Vizva721 from "contracts/abi/Vizva721.json";
import VizvaMarket_V1 from "contracts/abi/VizvaMarket_V1.json";
import VizvaLazyNFT from "contracts/abi/VizvaLazyNFT.json";
import IERC20 from "contracts/abi/IERC20.json";
import IERC721 from "contracts/abi/IERC721.json";
import WMATIC from "contracts/abi/WMATIC.json";

const polygonAddress = {
  vizva721: "0x3e0dE67132294A9Da8182C6cc3De5a29ed908609",
  vizvaMarket: "0x01D3a0E482E570e6Cca1f4E7dEFa162EE116E165",
  vizvaLazy: "0x6Bded1Bb0214e00De3d7F493b13Df7A171dD8F7C",
  WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
}

const mumbaiAddress = {
  vizva721: "0x37490e91Cf97D1240A239ed05AaFbdFAc1612756",
  vizvaMarket: "0xDf225E7b8aF30462206f5Eac84a7023F18BF3EB4",
  vizvaLazy: "0x6b9e93c1C019d7e8D97a2Dd752C51d2597690c78",
  WETH: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
}

const contractAddress = process.env.APP_ENV == "testnet" ? mumbaiAddress : polygonAddress

export const vizva721Option = {
  contractAddress: contractAddress.vizva721,
  abi: Vizva721.abi,
};

export const vizvaMarketOption = {
  contractAddress: contractAddress.vizvaMarket,
  abi: VizvaMarket_V1.abi,
};
export const lazyOption = {
  contractAddress: contractAddress.vizvaLazy,
  abi: VizvaLazyNFT.abi,
};
export const wethOption = {
  contractAddress: contractAddress.WETH,
  abi: WMATIC.abi,
};

export const IERC20Options = {
  abi: IERC20.abi,
};

export const IERC721Options = {
  abi: IERC721.abi,
};
export const PRICE_REGEX = /^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm;
export const NUMBER_REGEX = /^[0-9]+$/gm;
