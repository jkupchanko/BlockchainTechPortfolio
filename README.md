# BlockchainTechPortfolio

Welcome to my GitHub Projects - Here will be a taste of the projects I have been working on: 

Chainlink Automations: 

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






