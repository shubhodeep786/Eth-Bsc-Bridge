const { ethers } = require('ethers');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new ethers.providers.InfuraProvider('rinkeby', 'your_infura_project_id');
const web3Bsc = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '';
const adminWallet = new ethers.Wallet(adminPrivKey, web3Bsc);
const admin = adminWallet.address;

const bridgeEth = new ethers.Contract(
  BridgeEth.networks['4'].address,
  BridgeEth.abi,
  web3Eth
);

const bridgeBsc = new ethers.Contract(
  BridgeBsc.networks['97'].address,
  BridgeBsc.abi,
  adminWallet
);

bridgeEth.on('Transfer', async (from, to, amount, date, nonce) => {
  const tx = await bridgeBsc.mint(to, amount, nonce);
  const gasPrice = await web3Bsc.getGasPrice();
  const gasCost = await tx.estimateGas({ from: admin });
  const txData = {
    from: admin,
    to: bridgeBsc.address,
    data: tx.data,
    gasLimit: gasCost,
    gasPrice
  };
  const receipt = await adminWallet.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.hash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});