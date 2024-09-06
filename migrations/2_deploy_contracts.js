const RentalContract = artifacts.require("RentalHomeContract");

module.exports = function(deployer) {
  deployer.deploy(RentalContract);
};