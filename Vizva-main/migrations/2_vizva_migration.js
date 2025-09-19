const VizvaToken = artifacts.require("VizvaToken");

module.exports = function (deployer) {
  deployer.deploy(VizvaToken);
};