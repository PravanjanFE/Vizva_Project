const lazyNFT = artifacts.require("LazyNFT");

module.exports = function(deployer,network,accounts){
    deployer.deploy(lazyNFT,accounts[0]);
};