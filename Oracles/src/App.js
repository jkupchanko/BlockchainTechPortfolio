import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import PriceConsumer from "./build/contracts/PriceConsumer.json";

function Oracle() {
  const [price, setPrice] = useState("");

  const loadBlockchainData = async () => {
    const RPC_URL =
      "https://sepolia.infura.io/v3/dc398c0585b946909b2695f422c1bb9b";
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
    const networkId = await web3.eth.net.getId();
    const networkData = PriceConsumer.networks[networkId];
    if (networkData) {
      const abi = PriceConsumer.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      let priceFromChain = await contract.methods.getLatestPrice().call();
      priceFromChain = web3.utils.fromWei(priceFromChain, "ether");
      setPrice(priceFromChain.toString());
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h3>Network: Sepolia</h3>
        <h3>Aggregator: BTC/ETH</h3>
        <h3>Address: 0x9E37B8c45D11b86E090aEFc180CCA972f8FEc627</h3>
        <h3>Price: {price}</h3>
        <button onClick={loadBlockchainData}>Fetch Price</button>
      </div>
    </div>
  );
}

export default Oracle;
