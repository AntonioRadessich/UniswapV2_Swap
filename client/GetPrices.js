const ethers = require("ethers");
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
    pairABI 
} = require("./ABIList");

const directTrade = addressesRoute.length==0; 

// https://docs.bnbchain.org/docs/rpc/
const RPC = "https://bsc-dataseed.binance.org/";
const provider = new ethers.providers.JsonRpcProvider(RPC);

//Contracts connections
const contractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
const contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
const contractTokenIn = new ethers.Contract(addressFrom, erc20ABI, provider);
const contractTokenOut = new ethers.Contract(addressTo,erc20ABI,provider);

//getPrices 
const getPrices = async (amountInH) => {
    //Format amountIn
    const decimalsIn = await contractTokenIn.decimals();
    const amountIn = ethers.utils.parseUnits(amountInH,decimalsIn).toString();
    //Get amountOut
    const amountOut = directTrade ? await contractRouter.getAmountsOut(amountInH, [addressFrom,addressTo]) : await contractRouter.getAmountsOut(amountIn, [addressFrom,addressesRoute[0],addressTo]);
    const decimalsOut = await contractTokenOut.decimals();
    const amountOutH = directTrade ? amountOut[1] : ethers.utils.formatUnits(amountOut[addressesRoute.length+1],decimalsOut);
    console.log(amountOutH.toString());
}

const amountInH = "500"; //Must be a string
getPrices(amountInH);