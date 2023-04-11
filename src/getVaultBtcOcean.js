import { address, WhaleApiClient } from '@defichain/whale-api-client';

const ocean = new WhaleApiClient({ url: 'https://ocean.defichain.com', 
network: 'mainnet', version: 'v0', timeout: 60000 });

const PAGESIZE = 30;
let vaultCount = 0;
let btcSum = 0;
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
                    btcSum += parseFloat(collateral[j].amount);
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
console.log("Bitcoin in Vaults: "+btcSum);
