const { ok } = require("assert");
const assert = require("assert");
const { ethers } = require("ethers");
const lazyNFT = artifacts.require("LazyNFT");
const { LazyMinter } = require('../services/LazyMinter')

const wallets =  ethers.Wallet.fromMnemonic('kite invite rate speed green ladder cup fetch settle write jelly twice')

beforeEach(async () => {
    lazyNFTInstance = await lazyNFT.deployed()
})

contract('lazyNFT test', async accounts => {
    it('should redeem an nft from signed voucher', async () => {
        const chainIdBN = await lazyNFTInstance.getChainID();
        const chainInWei = web3.utils.fromWei(chainIdBN,'ether')
        const chainId = await ethers.utils.parseUnits(chainInWei)
        //console.log('accounts',chainId,chainIdBN.toString(),chainInWei)
        const lazyMinter = new LazyMinter({ contract: lazyNFTInstance, signer:wallets,chainId})
        const voucher = await lazyMinter.createVoucher(1, "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi")
        const redeem = await lazyNFTInstance.redeem(accounts[1],voucher,accounts[0])
        //console.log(voucher,redeem)
        assert(ok)
    });
    
    it("Should make payments available to minter for withdrawal", async function() {
        const chainIdBN = await lazyNFTInstance.getChainID();
        const chainInWei = web3.utils.fromWei(chainIdBN,'ether')
        const chainId = await ethers.utils.parseUnits(chainInWei)
        const lazyMinter = new LazyMinter({ contract: lazyNFTInstance, signer:wallets,chainId})
        const minPrice = await web3.utils.toWei('1',"ether")
        const voucher = await lazyMinter.createVoucher(2, "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi", minPrice)
        const previousBalanace = await web3.eth.getBalance(accounts[0]);
        const redeem = await lazyNFTInstance.redeem(accounts[1],voucher,accounts[0],{from: accounts[1], value:minPrice});
        const newBalance = await web3.eth.getBalance(accounts[0]);
        assert.strictEqual(parseInt(minPrice), newBalance - previousBalanace);
      })
    
})