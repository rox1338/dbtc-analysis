import { address, WhaleApiClient } from '@defichain/whale-api-client';

console.log("Bitcoin Burnbot Statistics");
var start = new Date();
console.log("Starttime: " + start.toLocaleString());

const ocean = new WhaleApiClient({ url: 'https://ocean.defichain.com', 
network: 'mainnet', version: 'v0', timeout: 60000 });

const fromAddress = "df1qc8ptw6vc9588w6f53fvcjsjx0fntv3men407a9";
const burnAddress = "8defichainBurnAddressXXXXXXXdRQkSm";
const PAGESIZE = 20;
var btcSum = 0;

var pageCount = 0;
var page = await ocean.poolpairs.listPoolSwapsVerbose('5', PAGESIZE);
while (page.length>0) {
    for (var i=0; i<page.length; i++) {
        var transaction = page[i];
        if (transaction.fromTokenId==0 
            && transaction.from?.address===fromAddress 
            && transaction.to?.address===burnAddress) {
            btcSum += parseFloat(transaction.to.amount);
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


var end = new Date();
console.log("Starttime: " + start.toLocaleString());
console.log("Endtime: " + end.toLocaleString());
console.log("BTC burned by Burnbot: " + btcSum);
