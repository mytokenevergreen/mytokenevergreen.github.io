$(document).ready(async function() {
    let pancake = await $.get("https://api.pancakeswap.info/api/tokens");
    let sfm_data = pancake['data']["0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3"];
    let bnb_data = pancake['data']["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"];
    let sfm_price = parseFloat(sfm_data['price']).toFixed(9);
    let bnb_price = parseFloat(bnb_data['price']).toFixed(9);
    let liquidity = await getLiquidity(sfm_price, bnb_price);
    let burned = await getBurned();
    let remaining = 1_000_000_000_000_000 - burned;
    let mcap = (remaining * sfm_price).toFixed(2);
    $('#value').html(sfm_price);
    $('#lptotal').html(insertCommas(parseFloat(liquidity).toFixed(2)));
    $('#burned').html((burned / 1_000_000_000_000).toFixed(3) + " <small>T</small>");
    $('#marketcap').html(insertCommas(mcap));
});
async function getPrice() {
    let token = "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3";
    let data = await getPriceForToken(token);
    return parseFloat(data['price']).toFixed(9);
}
async function getPriceForToken(address) {
    let pancake = await $.get("https://api.pancakeswap.info/api/tokens");
    let token = pancake['data'][address];
    return parseFloat(token['price']).toFixed(9);
}
async function getLiquidity(sfm_price, bnb_price) {
    let bnb_address = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    let pck_wallet = "0x9adc6fb78cefa07e13e9294f150c1e8c1dd566c0";
    let sfm_address = "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3";
    let bnb = await getBalance(bnb_address, pck_wallet);
    let sfm = await getBalance(sfm_address, pck_wallet);
    return ((bnb * bnb_price) + (sfm * sfm_price));
}
async function getBurned() {
    let address = "0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3";
    let wallet = "0x0000000000000000000000000000000000000001";
    let result = await getBalance(address, wallet);
    return result;
}
async function getBalance(fromWallet, toWallet) {
    let web3 = new Web3("https://bsc-dataseed1.binance.org:443");
    var contract = new web3.eth.Contract(getContract(),fromWallet);
    var balance = await contract.methods.balanceOf(toWallet).call();
    var decimals = await contract.methods.decimals().call();
    let formatted = balance / 10 ** decimals;
    return formatted;
}
function insertCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getContract() {
    return [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }],
        "name": "Approval",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "internalType": "uint256",
            "name": "minTokensBeforeSwap",
            "type": "uint256"
        }],
        "name": "MinTokensBeforeSwapUpdated",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }],
        "name": "OwnershipTransferred",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "internalType": "uint256",
            "name": "tokensSwapped",
            "type": "uint256"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "ethReceived",
            "type": "uint256"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokensIntoLiqudity",
            "type": "uint256"
        }],
        "name": "SwapAndLiquify",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": false,
            "internalType": "bool",
            "name": "enabled",
            "type": "bool"
        }],
        "name": "SwapAndLiquifyEnabledUpdated",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
        }, {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
        }],
        "name": "Transfer",
        "type": "event"
    }, {
        "inputs": [],
        "name": "_liquidityFee",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "_maxTxAmount",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "_taxFee",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "spender",
            "type": "address"
        }],
        "name": "allowance",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "spender",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "approve",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "spender",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "subtractedValue",
            "type": "uint256"
        }],
        "name": "decreaseAllowance",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "tAmount",
            "type": "uint256"
        }],
        "name": "deliver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "excludeFromFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "excludeFromReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "geUnlockTime",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "includeInFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "includeInReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "spender",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "addedValue",
            "type": "uint256"
        }],
        "name": "increaseAllowance",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "isExcludedFromFee",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "isExcludedFromReward",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
        }],
        "name": "lock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "tAmount",
            "type": "uint256"
        }, {
            "internalType": "bool",
            "name": "deductTransferFee",
            "type": "bool"
        }],
        "name": "reflectionFromToken",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "liquidityFee",
            "type": "uint256"
        }],
        "name": "setLiquidityFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "maxTxPercent",
            "type": "uint256"
        }],
        "name": "setMaxTxPercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "bool",
            "name": "_enabled",
            "type": "bool"
        }],
        "name": "setSwapAndLiquifyEnabled",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "taxFee",
            "type": "uint256"
        }],
        "name": "setTaxFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "swapAndLiquifyEnabled",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "uint256",
            "name": "rAmount",
            "type": "uint256"
        }],
        "name": "tokenFromReflection",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "totalFees",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "sender",
            "type": "address"
        }, {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "latestRoundData",
        "outputs": [{
            "internalType": "uint80",
            "name": "roundId",
            "type": "uint80"
        }, {
            "internalType": "int256",
            "name": "answer",
            "type": "int256"
        }, {
            "internalType": "uint256",
            "name": "startedAt",
            "type": "uint256"
        }, {
            "internalType": "uint256",
            "name": "updatedAt",
            "type": "uint256"
        }, {
            "internalType": "uint80",
            "name": "answeredInRound",
            "type": "uint80"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "uniswapV2Pair",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "uniswapV2Router",
        "outputs": [{
            "internalType": "contract IUniswapV2Router02",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "unlock",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "stateMutability": "payable",
        "type": "receive"
    }];
}
