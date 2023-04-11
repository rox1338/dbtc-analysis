import { JsonRpcClient } from "@defichain/jellyfish-api-jsonrpc";
import { readFileSync } from 'fs';

const rpcEndpoint = readFileSync('./rpcEndpoint');

const options = {
    timeout: 10000000
};

const client = new JsonRpcClient(rpcEndpoint, options)

const burnAddress = "8defichainBurnAddressXXXXXXXdRQkSm";
let last = null;
let loop = 0;
let btc = 0;
let eth = 0;
let usdt = 0;
let doge = 0;
let ltc = 0;
let bch = 0;
let usdc = 0;

console.log("Defichain BTC Account Analyzer");
console.log("This script is pretty slow and takes up to a day to finish...");


while (true) {
    loop++;
    let result = await client.account.listAccounts({
        including_start: last === null,
        limit: 100,
        start: last === null ? undefined : last
    });

    if (result.length === 0) {
        console.log("done");
        break;
    }

    console.log("running....: " + loop + ":  " + last);

    for (let entry in result) {
        const account = result[entry];

        if (!account.owner.addresses) {
            continue;
        }

        if (account.owner.addresses.length == 0) {
            continue;
        }

        let addamount = true;
        let addresses = account.owner.addresses;
        for (let address of addresses) {
            if (address === burnAddress) {
                addamount = false;
            }
        }

        if (addamount) {
            let splitted = account.amount.split('@');
            let token = splitted[1];
            let amount = Number.parseFloat(splitted[0]);

            if (token==="BTC") {
                btc += amount;
            } else if (token==="ETH") {
                eth += amount;
            } else if (token==="USDT") {
                usdt += amount;
            } else if (token==="DOGE") {
                doge += amount;
            } else if (token==="LTC") {
                ltc += amount;
            } else if (token==="BCH") {
                bch += amount;
            } else if (token==="USDC") {
                usdc += amount;
            }
        }

        last = account.key;
    }
}

console.log("Finished");
console.log("BTC in Accounts: " + btc)
console.log("ETH in Accounts: " + eth)
console.log("USDT in Accounts: " + usdt)
console.log("DOGE in Accounts: " + doge)
console.log("LTC in Accounts: " + ltc)
console.log("BCH in Accounts: " + bch)
console.log("USDC in Accounts: " + usdc)
