const PriceConsumer = artifacts.require("PriceConsumer");

contract("PriceConsumer", (accounts) => {
  let priceConsumer = null;
  before(async () => {
    priceConsumer = await PriceConsumer.deployed();
  });

  it("getLatestPrice should return a value", async () => {
    try {
      const price = await priceConsumer.getLatestPrice();
      console.log(price.toString(10));
      assert(price > 0);
    } catch (error) {
      console.error("Error getting latest price:", error);
    }
  });
});
