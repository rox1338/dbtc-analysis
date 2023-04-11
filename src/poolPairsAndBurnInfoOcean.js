import { address, WhaleApiClient } from '@defichain/whale-api-client';

const ocean = new WhaleApiClient({ url: 'https://ocean.defichain.com', 
network: 'mainnet', version: 'v0', timeout: 60000 });

const poolpair = await ocean.poolpairs.get('5');
const account = await ocean.address.listToken("8defichainBurnAddressXXXXXXXdRQkSm");
const burninfo = await ocean.stats.getBurn();
const token = await ocean.tokens.get('2');
const backingExpectation = parseFloat(token.minted) - parseFloat(burninfo.tokens[2]);

const response = await fetch('https://blockchain.info/q/addressbalance/38pZuWUti3vSQuvuFYs8Lwbyje8cmaGhrT');
const backingAddress = await response.json() / 100000000;

console.log("=======================================")
console.log("BTC in " + poolpair.symbol + ": " + poolpair.tokenA.reserve);
console.log("BTC Minted by Cake: " + token.minted);
console.log("BTC burned by Cake " + burninfo.tokens[2]);
console.log("BTC burned by Dexfee+Burnbot " + burninfo.dexfeetokens[0]);
console.log("Burnaccount: " + account[2].amount + account[2].symbol);
console.log("Backing expectation: " + backingExpectation);
console.log("Backing address: " + backingAddress);
console.log("=======================================")
