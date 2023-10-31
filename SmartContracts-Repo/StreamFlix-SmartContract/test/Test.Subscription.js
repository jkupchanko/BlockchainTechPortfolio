const { expect } = require("chai");

describe("Subscription Contract", function () {
  let subscription;

  before("Constructor", async function () {
    const [customer] = await ethers.getSigners();
    const Subscription = await ethers.getContractFactory("Subscription");
    subscription = await Subscription.deploy(customer.address);
    await subscription;
  });

  it("Should check the price and create a subscription", async function () {
    const name = "John";
    const planDuration = 2;
    const paymentCycle = 0;
    const customerRegister = 0;

    await subscription.checkPrice(
      name,
      planDuration,
      paymentCycle,
      customerRegister
    );
  });

  it("Use the trial for the subscription", async function () {
    const quotedTrial = 0;
    await subscription.trialSubscription(quotedTrial);
  });

  it("Purchase the subscription that had been created", async function () {
    const quotedSubscription = 0;
    await subscription.purchaseSubscription(quotedSubscription);
  });

  it("Cancel the active policy", async function () {
    const cancelActiveSubscription = 0;
    await subscription.cancelSubscription(cancelActiveSubscription);
  });
});
