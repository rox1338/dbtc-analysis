import { address, WhaleApiClient } from '@defichain/whale-api-client';
import { JsonRpcClient } from "@defichain/jellyfish-api-jsonrpc";
import { readFileSync } from 'fs';

const FEATURE_VAULTS = true;
const FEATURE_BURNBOT = false;
const FEATURE_ACCOUNTS = true;

const burnAddress = "8defichainBurnAddressXXXXXXXdRQkSm";
const cakeDBTCAddress = "df1qjl5qwq30t893njlut26w2cvvj6h9p2ksej45xuxw9nljm0zeg2zqs7f0zz";

console.log("dBTC Statistics");
var start = new Date();
console.log("Starttime: " + start.toLocaleString());

const response = await fetch('https://blockchain.info/q/addressbalance/3GcSHxkKY8ADMWRam51T1WYxYSb2vH62VL');
const backingAddress = await response.json() / 100000000;

const rpcEndpoint = readFileSync('./rpcEndpoint');

const options = {
    timeout: 10000000
};

const client = new JsonRpcClient(rpcEndpoint, options);

////
const poolpairResult = await client.poolpair.getPoolPair('BTC-DFI');
const poolpair = poolpairResult['5'];
const account = await client.account.getAccount(burnAddress);
const burninfo = await client.account.getBurnInfo();
const tokenResult = await client.token.getToken('BTC');
const token = tokenResult['2'];
const backingExpectation = parseFloat(token.minted) - parseFloat(burninfo.tokens[2]);
const blockcount = await client.blockchain.getBlockCount();
const cakeDBTC = await client.account.getAccount(cakeDBTCAddress);
console.log("Starttime: " + start.toLocaleString());
console.log("Blockcount: " + blockcount);
console.log("BTC in " + poolpair.symbol + ": " + poolpair.reserveA);
console.log("BTC Minted by Cake: " + token.minted);
console.log("BTC burned by Cake " + burninfo.tokens[2]);
console.log("Burn total: " + account[2]);
console.log("Backing expectation: " + backingExpectation);
console.log("Backing address: " + backingAddress);
console.log("Cake dBTC Buying: " + cakeDBTC);
////

let vaultSum = 0;
if (FEATURE_VAULTS) {
    console.log("Vaults");
    let last = undefined;

    const result = await client.vault.listVaults({
        start: last,
        including_start: last === undefined,
        limit: 20000
    })

    console.log("VaultCount: " + result.length)
    for (let i = 0; i < result.length; i++) {
        const x = result[i];
        const vault = await client.vault.getVault(x.vaultId);

        if (vault.state === "inLiquidation") {
            vault.batches.forEach(async (y) => {
                y.collaterals.forEach(async (c) => {
                    const splitted = c.split('@');
                    if (splitted[1] === "BTC") {
                        vaultSum += Number(splitted[0])
                    }
                });
            });
        }
        else {
            vault.collateralAmounts.forEach(async (y) => {
                const splitted = y.split('@');
                if (splitted[1] === "BTC") {
                    vaultSum += Number(splitted[0])
                }
            });
        }

        if (i%100 == 0) {
            process.stdout.write(".");
        }
    }
    console.log("\nBitcoin in Vaults: " + vaultSum);
}

let burnSum = 0;
if (FEATURE_BURNBOT) {
    console.log("Burnbot");
    const ocean = new WhaleApiClient({ url: 'https://ocean.defichain.com', network: 'mainnet', version: 'v0', timeout: 60000 });
    const fromAddress = "df1qc8ptw6vc9588w6f53fvcjsjx0fntv3men407a9";
    const SWAP_PAGESIZE = 20;
    var pageCount = 0;
    let page = await ocean.poolpairs.listPoolSwapsVerbose('5', SWAP_PAGESIZE);
    while (page.length>0) {
        for (var i=0; i<page.length; i++) {
            var transaction = page[i];
            if (transaction.fromTokenId==0 
                && transaction.from?.address===fromAddress 
                && transaction.to?.address===burnAddress) {
                    burnSum += parseFloat(transaction.to.amount);
            }
        }
        pageCount++
        if (pageCount%100==0) {
            console.log("Page:"+pageCount+" length:"+page.length+" btcSum:"+burnSum);
        }

        try {
            var newpage = await ocean.paginate(page);
            page = newpage;
        } catch (err) {
            // try again
            page = await ocean.paginate(page);
        }
    }
    console.log("Burnbot finished");
} else {
    burnSum = 108.16;
}

////
const dexFeeSum = parseFloat(burninfo.dexfeetokens[1]) - burnSum;
////

let last = null;
let loop = 0;
let btc = 0;
console.log("Accounts");
while (FEATURE_ACCOUNTS) {
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
            }
        }

        last = account.key;
    }
}



var end = new Date();
console.log("=======================================");
console.log("Endresult");
console.log("Starttime: " + start.toLocaleString());
console.log("Endtime: " + end.toLocaleString());
console.log("Blockcount: " + blockcount);
console.log("BTC in Accounts: " + btc);
console.log("BTC in " + poolpair.symbol + ": " + poolpair.reserveA);
console.log("BTC Collateral: " + vaultSum);
console.log("BTC Minted by Cake: " + token.minted);
console.log("BTC burned by Cake " + burninfo.tokens[2]);
console.log("BTC burned by Burnbot " + burnSum);
console.log("BTC burned by Dexfee " + dexFeeSum);
console.log("Burn total: " + account[2]);
console.log("Backing expectation: " + backingExpectation);
console.log("Backing address: " + backingAddress);
console.log("Cake dBTC Buying: " + cakeDBTC);
console.log("=======================================")

