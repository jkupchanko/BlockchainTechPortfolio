const { Web3 } = require("web3");

const web3 = new Web3(
  "https://sepolia.infura.io/v3/dc398c0585b946909b2695f422c1bb9b"
);

const createRawTx = async (myAddress, privateKey, to, amount) => {
  const nonce = await web3.eth.getTransactionCount(myAddress);
  const rawTx = {
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(20000000000),
    gasLimit: web3.utils.toHex(21000),
    to: to,
    value: web3.utils.toWei(amount.toString(), "ether"),
    data: "",
  };
  return rawTx;
};

const checkTransaction = async (myAddress, privateKey, to, amount) => {
  const rawTx = await createRawTx(myAddress, privateKey, to, amount);
  return rawTx;
};

const sendTransaction = async (myAddress, privateKey, to, amount) => {
  const rawTx = await createRawTx(myAddress, privateKey, to, amount);
  const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

module.exports = { checkTransaction, sendTransaction };
