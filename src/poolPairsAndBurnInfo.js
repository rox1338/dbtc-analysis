import { JsonRpcClient } from "@defichain/jellyfish-api-jsonrpc";
import { readFileSync } from 'fs';

const rpcEndpoint = readFileSync('./rpcEndpoint');

const options = {
    timeout: 10000000
};

const client = new JsonRpcClient(rpcEndpoint, options)

const poolpairs = await client.poolpair.listPoolPairs()
const account = await client.account.getAccount("8defichainBurnAddressXXXXXXXdRQkSm")
const burninfo = await client.account.getBurnInfo();

console.log("=======================================")
console.log("BTC in " + poolpairs['5'].symbol + ": " + poolpairs['5'].reserveA.toString())
console.log("ETH in " + poolpairs['4'].symbol + ": " + poolpairs['4'].reserveA.toString())
console.log("USDT in " + poolpairs['6'].symbol + ": " + poolpairs['6'].reserveA.toString())
console.log("USDT in " + poolpairs['101'].symbol + ": " + poolpairs['101'].reserveA.toString())
console.log("DOGE in " + poolpairs['8'].symbol + ": " + poolpairs['8'].reserveA.toString())
console.log("LTC in " + poolpairs['10'].symbol + ": " + poolpairs['10'].reserveA.toString())
console.log("BCH in " + poolpairs['12'].symbol + ": " + poolpairs['12'].reserveA.toString())
console.log("USDC in " + poolpairs['14'].symbol + ": " + poolpairs['14'].reserveA.toString())
console.log("USDC in " + poolpairs['102'].symbol + ": " + poolpairs['102'].reserveA.toString())
console.log("Burnaccount: " + account.toString())
console.log("BTC burned (without Dexfee) " + burninfo.tokens[2])
console.log("BTC burned by Dexfee " + burninfo.dexfeetokens[0])
console.log("=======================================")
