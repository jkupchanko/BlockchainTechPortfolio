const { Web3 } = require("web3");

const web3 = new Web3(
  "https://sepolia.infura.io/v3/dc398c0585b946909b2695f422c1bb9b"
);

const checkBalance = async (address) => {
  const balanceWei = await web3.eth.getBalance(address);
  const balanceEther = web3.utils.fromWei(balanceWei, "ether");
  console.log(`Balance of ${address}: ${balanceEther} Ether`);
};

checkBalance("0x98fb053C78c217C7DEbFD356E1676801411f499F");
