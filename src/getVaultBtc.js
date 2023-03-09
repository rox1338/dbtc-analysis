import { JsonRpcClient } from "@defichain/jellyfish-api-jsonrpc";
import { readFileSync } from 'fs';

const rpcEndpoint = readFileSync('./rpcEndpoint');

const options = {
    timeout: 10000000
};

const client = new JsonRpcClient(rpcEndpoint, options)

let last = undefined;

const result = await client.vault.listVaults({
    start: last,
    including_start: last === undefined,
    limit: 20000
})

console.log("Results: " + result.length)
let btc = 0;
let eth = 0;
let usdt = 0;
let doge = 0;
let ltc = 0;
let bch = 0;
let usdc = 0;

for (let i = 0; i < result.length; i++) {
    const x = result[i];
    const vault = await client.vault.getVault(x.vaultId);

    if (vault.state === "inLiquidation") {
        vault.batches.forEach(async (y) => {
            y.collaterals.forEach(async (c) => {
                const splitted = c.split('@');
                if (splitted[1] === "BTC") {
                    btc += Number(splitted[0])
                } else if (splitted[1] === "ETH") {
                    eth += Number(splitted[0])
                } else if (splitted[1] === "USDT") {
                    usdt += Number(splitted[0])
                } else if (splitted[1] === "DOGE") {
                    doge += Number(splitted[0])
                } else if (splitted[1] === "LTC") {
                    ltc += Number(splitted[0])
                } else if (splitted[1] === "BCH") {
                    bch += Number(splitted[0])
                } else if (splitted[1] === "USDC") {
                    usdc += Number(splitted[0])
                }
            });
        });
    }
    else {
        vault.collateralAmounts.forEach(async (y) => {
            const splitted = y.split('@');
            if (splitted[1] === "BTC") {
                btc += Number(splitted[0])
            } else if (splitted[1] === "ETH") {
                eth += Number(splitted[0])
            } else if (splitted[1] === "USDT") {
                usdt += Number(splitted[0])
            } else if (splitted[1] === "DOGE") {
                doge += Number(splitted[0])
            } else if (splitted[1] === "LTC") {
                ltc += Number(splitted[0])
            } else if (splitted[1] === "BCH") {
                bch += Number(splitted[0])
            } else if (splitted[1] === "USDC") {
                usdc += Number(splitted[0])
            }
        });
    }

    if (i%1000 == 0) {
        console.log(i + "/" + result.length)
    }
}

console.log("BTC in Vaults: " + btc)
console.log("ETH in Vaults: " + eth)
console.log("USDT in Vaults: " + usdt)
console.log("DOGE in Vaults: " + doge)
console.log("LTC in Vaults: " + ltc)
console.log("BCH in Vaults: " + bch)
console.log("USDC in Vaults: " + usdc)

