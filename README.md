# BlockchainTechPortfolio

Welcome to my GitHub Projects - Here will be a taste of the projects I have been working on: 

**Chainlink Automations:** 

Automation Smart Contract

This is a simple smart contract developed in the Solidity language. The main functions of this contract are:
Counting Events: The contract has an internal counter that can be incremented with a pressCounter function. 
However, the function has a restriction such that it can only be called once every 10 seconds.
Counter Viewing: Anyone can view the current count using the viewCounter function without making any transaction on the blockchain. This function merely reads the data.
Time Calculation: The getTimeLeft function can be used to determine how much time is left before the pressCounter function can be invoked again.

Web3 Integration with React

This section consists of a basic React application that interacts with the Ethereum blockchain:
Web3 Initialization: It uses the Web3 library to connect to the Ethereum network through the Infura service.
Contract Interaction: The React application establishes a connection to the Automation smart contract using its ABI and address.
Real-time Updates: Using React's useEffect hook, the application periodically (every 10 seconds) fetches the latest counter value from the smart contract and updates its state, displaying the current count.

Testing the Automation Contract

Here, there's a simple test suite to ensure the functionality of the Automation contract:
Setup: Before the tests run, the Automation contract is deployed to the network.
Functionality Test: The main test involves trying to invoke the pressCounter function to check if the counter can be incremented and if the time restrictions apply correctly.

**PriceConsumer Smart Contract:**

Integrated with Chainlink:
The contract uses Chainlink's AggregatorV3Interface to access external price data.
Specifically, it taps into the BTC/ETH exchange rate from a predefined Chainlink aggregator.

Key Functions:
getLatestPrice: Fetches and returns the current BTC/ETH exchange rate.
Web3 Integration with React App (Oracle)

Blockchain Connectivity:
Uses Web3 to connect to the Ethereum network via Infura.
It identifies the network ID and checks for the deployed PriceConsumer contract on that network.
User Interface:

Displays details about the network, the aggregator, and its address.
Shows the latest fetched BTC/ETH exchange rate.
Users can click "Fetch Price" to retrieve and view the latest exchange rate from the blockchain.
Testing the PriceConsumer Contract

Test Setup:
Before any tests run, the PriceConsumer contract is deployed to the network.
Functionality Test:

A test (getLatestPrice should return a value) checks if invoking the getLatestPrice function successfully returns a BTC/ETH price value. The value returned should be greater than 0.
In summary, the Oracles project serves as a bridge to access the latest BTC/ETH exchange rate using Chainlink oracles and presents this data to users via a simple web interface. It also includes tests to ensure the contract's correct operation.

**Key Generation & Ethereum Address Processing**

**Library Dependencies**
crypto: Used for cryptographic functions.
elliptic: Provides functionalities for using Elliptic Curve Cryptography.
keccak256: Cryptographic hash function used in Ethereum.
Private Key to Public Key Conversion
The script initializes with the secp256k1 elliptic curve, which is the curve Ethereum uses.
Given a private key, it creates a key pair.
The public key is generated from this private key.
Ethereum Address Generation
Ethereum addresses are derived by hashing the public key with keccak256 and then taking the last 20 bytes of this hash.

**Private Key Generation:**
This section of the code randomly generates a 32-byte private key.
React Frontend: Wallet Transaction Interface

**State Management:**
The React component MyComponent manages various states such as address, privateKey, transferAddress, amount, error, transaction details (nonce, gasPrice, gasLimit, toAddress), and feedback messages (checkStatus, deployStatus).

**Inputs & Data Binding:**
The user provides their Ethereum address, private key, recipient's address, and the ETH amount they wish to transfer.
The provided data gets bound to the component's state, enabling interactive functionalities.

**Transaction Checking & Sending:**
The handleCheck function checks a transaction's details based on user inputs.
The handleDeploy function sends the transaction to the Ethereum network.
Both methods interact with external utility functions (checkTransaction, sendTransaction) imported from WalletLogic.js (not provided in the code you shared).

**Rendering & User Feedback:**
The component displays various feedback messages based on the transaction's status or errors.
It also showcases a user's transaction details such as nonce, gas price, gas limit, and recipient address.

**Main App Rendering:**
The App component wraps the MyComponent and serves as the main entry point for the wallet interface. It renders the entire wallet interface with the title "BlockPulse Wallet".

**Summary:**
Your code provides functionalities for Ethereum key and address generation, along with a wallet interface to check and deploy transactions to the Ethereum network. 
This seems to be a foundational building block of an Ethereum-based wallet application.

