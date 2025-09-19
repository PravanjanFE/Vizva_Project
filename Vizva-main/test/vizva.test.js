const assert = require("assert");
const VizvaToken = artifacts.require("VizvaToken");
const VizvaMarket = artifacts.require("VizvaMarketContract");
const WETH = artifacts.require("WETH9");
const { LazyBidder } = require("../services/Bidder");
const { ethers } = require("ethers");

const wallets = ethers.Wallet.fromMnemonic(
  "kite invite rate speed green ladder cup fetch settle write jelly twice"
);

beforeEach(async () => {
  VizvaTokenInstance = await VizvaToken.deployed();
  VizvaMarketInstance = await VizvaMarket.deployed();
  WETHInstance = await WETH.deployed();
});

contract("VIZVA MARKETPLACE TEST", (accounts) => {
  it("should return token initial call data", async () => {
    const name = await VizvaTokenInstance.name.call();
    const symbol = await VizvaTokenInstance.symbol.call();
    assert.strictEqual("VIZVA TOKEN", name);
    assert.strictEqual("VIZVA", symbol);
  });

  it("should create new token", async () => {
    const newToken = await VizvaTokenInstance.createItem(
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
    );
    const from = newToken.logs[0].args["from"];
    const to = newToken.logs[0].args["to"];
    const tokenId = newToken.logs[0].args["tokenId"];
    assert.strictEqual("0x0000000000000000000000000000000000000000", from);
    assert.strictEqual(accounts[0], to);
    assert.strictEqual(1, parseInt(tokenId));
  });

  it("should create new token and add it to market", async () => {
    const newToken = await VizvaTokenInstance.createItem(
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
    );
    const tokenId = newToken.logs[0].args["tokenId"];
    const vizvaAddress = await VizvaMarketInstance.address;
    const tokenAddress = await VizvaTokenInstance.address;
    await VizvaTokenInstance.setApprovalForAll(vizvaAddress, true);
    const marketData = await VizvaMarketInstance.addItemToMarket(
      tokenAddress,
      tokenId,
      1
    );
    assert.strictEqual(0, parseInt(marketData.logs[0].args["id"]));
    assert.strictEqual(2, parseInt(marketData.logs[0].args["tokenId"]));
    assert.strictEqual(tokenAddress, marketData.logs[0].args["tokenAddress"]);
    assert.strictEqual(1, parseInt(marketData.logs[0].args["askingPrice"]));
  });

  it("should allow token purchase", async () => {
    const Id = 0;
    const tokenId = 2;
    const tokenAddress = await VizvaTokenInstance.address;
    const marketData = await VizvaMarketInstance.buyItem(
      tokenAddress,
      tokenId,
      Id,
      {
        from: accounts[1],
        value: web3.utils.toWei("1", "ether"),
      }
    );
    const owner = await VizvaTokenInstance.ownerOf.call(2);
    assert.strictEqual(accounts[1], marketData.logs[0].args["buyer"]);
    assert.strictEqual(Id, parseInt(marketData.logs[0].args["id"]));
    assert.strictEqual(accounts[1], owner);
  });

  it("allow create bid voucher and finalize auction", async () => {
    const newToken = await VizvaTokenInstance.createItem(
      "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      { from: accounts[1] }
    );
    const tokenId = newToken.logs[0].args["tokenId"];
    const vizvaAddress = await VizvaMarketInstance.address;
    const tokenAddress = await VizvaTokenInstance.address;
    await VizvaTokenInstance.setApprovalForAll(vizvaAddress, true, {
      from: accounts[1],
    });
    const marketData = await VizvaMarketInstance.addItemToMarket(
      tokenAddress,
      tokenId,
      web3.utils.toWei("1","ether"),
      { from: accounts[1] }
    );
    await WETHInstance.deposit({from:accounts[0], value: web3.utils.toWei("1", "ether") });
    await WETHInstance.approve(VizvaMarketInstance.address, web3.utils.toWei("1", "ether"), {from: accounts[0]});
    const WETHBalanceOwnerBefore = await WETHInstance.balanceOf.call(accounts[1]);
    const WETHBalanceBuyerBefore = await WETHInstance.balanceOf.call(accounts[0]);
    const marketId = parseInt(marketData.logs[0].args["id"]);
    const chainIdBN = await VizvaMarketInstance.getChainID();
    const chainInWei = web3.utils.fromWei(chainIdBN, "ether");
    const chainId = ethers.utils.parseUnits(chainInWei);

    const lazyBidder = new LazyBidder({
      contract: VizvaMarketInstance,
      signer: wallets,
      chainId,
    });

    const voucher = await lazyBidder.createBidVoucher(
      tokenAddress,
      parseInt(tokenId),
      parseInt(marketId),
      web3.utils.toWei("1","ether")
    );
    const previousOwner = await VizvaTokenInstance.ownerOf.call(tokenId);
    const result = await VizvaMarketInstance.finalizeBid(
      voucher,
      WETHInstance.address,
      accounts[0]
    );
    const currentOwner = await VizvaTokenInstance.ownerOf.call(tokenId);
    const WETHBalanceOwnerAfter = await WETHInstance.balanceOf.call(accounts[1]);
    const WETHBalanceBuyerAfter = await WETHInstance.balanceOf.call(accounts[0]);
    assert.strictEqual(accounts[0],result.logs[0].args["buyer"]);
    assert.strictEqual(accounts[1],previousOwner);
    assert.strictEqual(accounts[0],currentOwner);
    assert.strictEqual(parseInt(WETHBalanceBuyerBefore),parseInt(WETHBalanceOwnerAfter));
    assert.strictEqual(parseInt(WETHBalanceOwnerBefore),parseInt(WETHBalanceBuyerAfter));

  });
});
