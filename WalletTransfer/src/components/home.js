import React, { useState } from "react";
import {
  checkTransaction,
  sendTransaction,
} from "../deploy_test/WalletLogic.js";

function MyComponent() {
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [checkStatus, setCheckStatus] = useState(null);
  const [deployStatus, setDeployStatus] = useState(null);

  const [nonce, setNonce] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [gasLimit, setGasLimit] = useState(null);
  const [toAddress, setToAddress] = useState(null);

  const handleAddressChange = ({ target: { value } }) => {
    if (value.length !== 42) {
      setError("Address must be 42 characters long");
    } else {
      setError("");
    }
    setAddress(value);
  };

  const handlePrivateKeyChange = ({ target: { value } }) => {
    setPrivateKey(value);
  };

  const handleCheck = async () => {
    setError("");
    setCheckStatus(null);
    try {
      const rawTx = await checkTransaction(
        address,
        privateKey,
        transferAddress,
        amount
      );
      setNonce(rawTx.nonce);
      setGasPrice(rawTx.gasPrice);
      setGasLimit(rawTx.gasLimit);
      setToAddress(rawTx.to);
      setCheckStatus("Check completed successfully.");
    } catch (error) {
      setError(error.message);
      setCheckStatus(
        "Check failed. Please make sure all fields are filled correctly."
      );
    }
  };

  const handleDeploy = async () => {
    setError("");
    setDeployStatus(null);
    try {
      const receipt = await sendTransaction(
        address,
        privateKey,
        transferAddress,
        amount
      );
      setNonce(receipt.transaction.nonce);
      setGasPrice(receipt.transaction.gasPrice);
      setGasLimit(receipt.transaction.gas);
      setToAddress(receipt.transaction.to);
      if (receipt.status) {
        setDeployStatus("Transaction was successfully sent!");
      } else {
        setDeployStatus("Transaction failed. Please check your inputs.");
      }
    } catch (error) {
      setError(error.message);
      setDeployStatus(
        "Deploy failed. Please make sure all fields are filled correctly."
      );
    }
  };

  return (
    <div>
      <h2>Rules</h2>
      <p>
        Please make sure to fill out all fields before checking or deploying a
        transaction.
      </p>
      <p>Address: {address}</p>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter Address"
      />
      <p>Private Key</p>
      <input
        type="password"
        value={privateKey}
        onChange={handlePrivateKeyChange}
        placeholder="Enter Private Key"
      />
      <p>Transfer Address</p>
      <input
        type="text"
        value={transferAddress}
        onChange={(event) => setTransferAddress(event.target.value)}
        placeholder="Enter Transfer Address"
      />
      <p>Amount of ETH</p>
      <input
        type="number"
        value={amount}
        step="0.0001"
        onChange={(event) => setAmount(event.target.value)}
        placeholder="Enter Amount of ETH"
      />
      <p>Press "Check" to check the Wallet Details</p>
      <button onClick={handleCheck}>Check</button>
      <p>Press "Deploy" to Send ETH in Wei</p>
      <button onClick={handleDeploy}>Deploy</button>
      {error && <p>Error: {error}</p>}
      {checkStatus && <p>{checkStatus}</p>}
      {deployStatus && <p>{deployStatus}</p>}
      <br />
      <h4>---- Wallet Details ----</h4>
      <p>Nonce: {nonce}</p>
      <p>Gas Price: {gasPrice}</p>
      <p>Gas Limit: {gasLimit}</p>
      <p>To Address: {toAddress}</p>
      <h4>-----------------------</h4>
    </div>
  );
}

export default MyComponent;
