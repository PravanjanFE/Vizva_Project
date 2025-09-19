const Marketplace = artifacts.require("VizvaMarketContract");

module.exports = function (deployer) {
  deployer.deploy(Marketplace);
};