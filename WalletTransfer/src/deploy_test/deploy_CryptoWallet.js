// const { Web3 } = require("web3");

// const deploy = async () => {
//   const myAddress = "0x98fb053C78c217C7DEbFD356E1676801411f499F";
//   const privateKey =
//     "0x503051fd9758f8301805e867cca12d34634e9ffccf17fb7e709ed2cd8a48ddd4";
//   const web3 = new Web3(
//     "https://sepolia.infura.io/v3/dc398c0585b946909b2695f422c1bb9b"
//   );

//   // Get the account nonce
//   const nonce = await web3.eth.getTransactionCount(myAddress);

//   // Create a raw transaction
//   const rawTx = {
//     nonce: nonce,
//     gasPrice: web3.utils.toHex(20000000000),
//     gasLimit: web3.utils.toHex(21000),
//     to: "0x0F734D42A7Fc2deD49762b1E6cCFc6c2d8a7e1B8",
//     value: web3.utils.toWei("1", "ether"),
//     data: "",
//   };

//   // Sign Raw Transaction
//   const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);

//   console.log(signedTx);
// };

// deploy();
