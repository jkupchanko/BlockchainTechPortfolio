import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Automation from "./build/contracts/Automation.json";
import "./App.css";

const App = () => {
  const [counter, setCounter] = useState(0);

  const infuraUrl = `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

  const contractAddress = "0xBA694439b44D02838E422F72479c5390e87a1b3d";
  const automationContract = new web3.eth.Contract(
    Automation.abi,
    contractAddress
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await automationContract.methods.viewCounter().call();
      console.log("viewCounter result:", result);
      setCounter(result.toString());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <h2>Counter: {counter}</h2>
      </div>
    </div>
  );
};

export default App;
