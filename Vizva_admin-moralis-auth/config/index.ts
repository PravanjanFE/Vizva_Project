import VizvaLazyCollectionClone from "contracts/abi/VizvaLazyCollectionClone.json";
import VizvaMarket_V1 from "contracts/abi/VizvaMarket_V1.json";

const polygonAddress = {
    vizva721: "0x3e0dE67132294A9Da8182C6cc3De5a29ed908609",
    vizvaMarket: "0x01D3a0E482E570e6Cca1f4E7dEFa162EE116E165",
    vizvaLazy: "0x6Bded1Bb0214e00De3d7F493b13Df7A171dD8F7C",
    WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    VizvaLazyCollectionClone: "0x5Bb1889790Eb8c5D28aA337CeB5CCa8d789455c8"
}

const mumbaiAddress = {
    vizva721: "0xe69c547ad3eadbc729ec33e10b1987d634ff3e19",
    vizvaMarket: "0x3dc565d608b970eb3a643dba0da6bf2fdb074d00",
    vizvaLazy: "0xe41DCEdFac12076A26bD80607b50Ca7ef53a0adC",
    WETH: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    VizvaLazyCollectionClone: "0x5Bb1889790Eb8c5D28aA337CeB5CCa8d789455c8"
}

const contractAddress = process.env.APP_ENV == "testnet" ? mumbaiAddress : polygonAddress

export const vizvaLazyCollectionOption = {
    contractAddress: contractAddress.VizvaLazyCollectionClone,
    abi: VizvaLazyCollectionClone.abi,
};

export const vizvaMarketOption = {
    contractAddress: contractAddress.vizvaMarket,
    abi: VizvaMarket_V1.abi,
};

export const PRICE_REGEX = /^(\.[0-9]*)$|^([0-9]+(\.[0-9]*)?)$/gm;
export const NUMBER_REGEX = /^[0-9]+$/gm;
