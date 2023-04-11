import { address, WhaleApiClient } from '@defichain/whale-api-client';

console.log("dBTC Statistics");
var start = new Date();
console.log("Starttime: " + start.toLocaleString());

const response = await fetch('https://blockchain.info/q/addressbalance/38pZuWUti3vSQuvuFYs8Lwbyje8cmaGhrT');
const backingAddress = await response.json() / 100000000;

const ocean = new WhaleApiClient({ url: 'https://ocean.defichain.com', 
network: 'mainnet', version: 'v0', timeout: 60000 });



console.log("Vaults");
const PAGESIZE = 30;
let vaultCount = 0;
let vaultSum = 0;
let page = await ocean.loan.listVault(PAGESIZE);

while (page.length>0) {
    vaultCount += page.length;
    if (vaultCount%(PAGESIZE*20)==0) {
        console.log("VaultCount:"+vaultCount+" page-length:"+page.length);
    }

    for (let i=0; i<page.length; i++) {
        let collateral = page[i].collateralAmounts;
        if (collateral !== undefined) {
            for (let j=0; j<collateral.length; j++) {
                if (collateral[j].symbol==='BTC') {
                    vaultSum += parseFloat(collateral[j].amount);
                }
            }
        }
    }

    try {
        var newpage = await ocean.paginate(page);
        page = newpage;
    } catch (err) {
        // try again
        page = await ocean.paginate(page);
    }
}

console.log("Final VaultCount:"+vaultCount);
console.log("Bitcoin in Vaults: "+vaultSum);




console.log("Burnbot");
const fromAddress = "df1qc8ptw6vc9588w6f53fvcjsjx0fntv3men407a9";
const burnAddress = "8defichainBurnAddressXXXXXXXdRQkSm";
const SWAP_PAGESIZE = 20;
var burnSum = 0;

var pageCount = 0;
page = await ocean.poolpairs.listPoolSwapsVerbose('5', SWAP_PAGESIZE);
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
        console.log("Page:"+pageCount+" length:"+page.length+" btcSum:"+btcSum);
    }

    try {
        var newpage = await ocean.paginate(page);
        page = newpage;
    } catch (err) {
        // try again
        page = await ocean.paginate(page);
    }
}



const poolpair = await ocean.poolpairs.get('5');
const account = await ocean.address.listToken("8defichainBurnAddressXXXXXXXdRQkSm");
const burninfo = await ocean.stats.getBurn();
const token = await ocean.tokens.get('2');
const backingExpectation = parseFloat(token.minted) - parseFloat(burninfo.tokens[2]);
const dexFeeSum = parseFloat(burninfo.dexfeetokens[0]) - burnSum;

var end = new Date();
console.log("=======================================")
console.log("Starttime: " + start.toLocaleString());
console.log("Endtime: " + end.toLocaleString());
console.log("BTC in " + poolpair.symbol + ": " + poolpair.tokenA.reserve);
console.log("BTC Collateral: " + vaultSum);
console.log("BTC Minted by Cake: " + token.minted);
console.log("BTC burned by Cake " + burninfo.tokens[2]);
console.log("BTC burned by Burnbot " + burnSum);
console.log("BTC burned by Dexfee " + dexFeeSum);
console.log("Burn total: " + account[2].amount);
console.log("Backing expectation: " + backingExpectation);
console.log("Backing address: " + backingAddress);
console.log("=======================================")
