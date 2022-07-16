const { ethers } = require("ethers");

const { 
    addressFactory,
    addressRouter,
    addressFrom,
    addressesRoute,
    addressTo,
} = require("./AddressList");

const { 
    erc20ABI, 
    factoryABI, 
    routerABI, 
} = require("./ABIList");

const {
    getAmountIn,
    getAmountOut,
} = require("./GetPrices")

const directTrade = addressesRoute.length==0; 

// https://docs.bnbchain.org/docs/rpc/
const RPC = "https://bsc-dataseed.binance.org/";
const provider = new ethers.providers.JsonRpcProvider(RPC);

//Wallet signer
const myAddress="0xC6EAeC5941fB460Ea749663525949030980D727B";
const myPrivateKey="afa3fac35e6c9021d125d95c358d4460bf482dbdc432c940af351d97410c14ff";
const signer = new ethers.Wallet(myPrivateKey,provider);

//Contracts connections
const contractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
const contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
const contractTokenIn = new ethers.Contract(addressFrom, erc20ABI, provider);
//Get amountIn
/*
const getAmountIn = async () => {
    const decimalsIn = await contractTokenIn.decimals();
    const amountIn = ethers.utils.parseUnits(amountInH,decimalsIn).toString();
    return amountIn;
}
*/

//Get amountOut
/*
const getAmountOut = async () => {  
    const amountIn = await getAmountIn();
    const amountOut = await contractRouter.getAmountsOut(amountIn, [addressFrom,addressTo]);
    return amountOut[1].toString();
};
*/
//Swap Function
 
const exchangeTokens = async () => {
    const txSwap = await contractRouter.populateTransaction.swapExactTokensForTokens(
        await getAmountIn(),//amountIn
        await getAmountOut(amountInH),//amountOut
        [addressFrom,addressTo],//path[]
        myAddress,//addressTo
        Date.now() * 1000 ,//deadline
        {
            gasLimit: 200000,
            gasPrice: ethers.utils.parseUnits("5.5","gwei"),
        }//gas
    );
    let sendTxn = (await signer).sendTransaction(txSwap);
};

const amountInH = "1";
exchangeTokens();