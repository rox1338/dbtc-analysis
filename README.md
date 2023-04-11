# DBTC-Analysis
These are the 4 scripts I use to create the charts here:
http://www.defichain8.com/

## RPC Endpoint
In order to run most of the scripts you need to run a Defichain full node because they are using RPC calls to the full node.
You need to create a file called rpcEndpoint in the folder src which contains the RPC endpoint to connect to.
This might look like this: http://user:password@127.0.0.1:8555

## Credits
getAccountBtc.js and getVaultBtc.js are basically copy-paste-modified from https://github.com/dpfaffenbauer/defichain-icx-exploit-review/

## My run order
The way I run the scripts to collect data is the following:
1. Start and update full node
2. Run *setnetworkactive false* on Defichain commandline
3. Run *node getAccountBtc.js*
4. Run *node getDataOcean.js* in parallel
5. Collect resulting data

## Donation Address
If you want to support this, you can donate to the following Defichain address:
df1qp3fx9pfju078rz4ewn5gn899358wyvhh4wy63c
