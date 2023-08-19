const Automation = artifacts.require("automation");

contract("automation", (accounts) => {
  let automation = null;
  before(async () => {
    automation = await Automation.deployed();
  });

  it("test automation", async () => {
    try {
      const pressCounterTest = await automation.pressCounter();
      console.log(pressCounterTest, "Press Counter Function is running!");
    } catch (error) {
      console.log("Error with Counter!", error);
    }
  });
});
