const Web3 = require("web3");
const { assert, expect } = require("chai");

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const InsuranceContract = artifacts.require("Insurance");

contract("Insurance", (accounts) => {
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await InsuranceContract.deployed();
  });

  it("should quote a policy and check if it's active", async () => {
    const coverageDuration = 2;
    const coverageType = 0;

    await contractInstance.quotePolicy(coverageDuration, coverageType, {
      from: accounts[0],
    });
  });

  it("should purchase a policy and check if it's active", async () => {
    const policySelection = 0;
    await contractInstance.purchasePolicy(policySelection, {
      from: accounts[0],
    });
    const isActive = await contractInstance.activePolicy(accounts[0]);
    assert.isTrue(isActive, "Policy activated successfully.");
  });

  it("should cancel the purchased policy and check if it's inactive", async () => {
    const policySelection = 0;
    await contractInstance.cancelPolicy(policySelection, {
      from: accounts[0],
    });
    const isNotActive = await contractInstance.activePolicy(accounts[0]);
    assert.isFalse(isNotActive, "Policy cancelled successfully.");
  });
});
