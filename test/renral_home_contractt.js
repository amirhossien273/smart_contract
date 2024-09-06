const RentalContract = artifacts.require("RentalHomeContract");

contract("RentalHomeContract", (accounts) => {

    console.log("accounts: ", accounts);
  const tenant = accounts[1];
  const landlord = accounts[2];
  
//   it("should set and get rental agreement correctly", async () => {
//     const instance = await RentalContract.deployed();
    
//     await instance.setRentalAgreement(
//       1, 
//       1000, 
//       "USD", 
//       "Monthly", 
//       "09123456789", 
//       "1234567890", 
//       tenant, 
//       landlord
//     );
    
//     const agreement = await instance.getRentalAgreement();
    
//     assert.equal(agreement.home_id, 1, "Home ID should be 1");
//     assert.equal(agreement.price, 1000, "Price should be 1000");
//     assert.equal(agreement.price_type, "USD", "Price type should be USD");
//     assert.equal(agreement.price_type2, "Monthly", "Price type2 should be Monthly");
//     assert.equal(agreement.mobile, "09123456789", "Mobile should be 09123456789");
//     assert.equal(agreement.national_code, "1234567890", "National code should be 1234567890");
//     assert.equal(agreement.tenant_public_key, tenant, "Tenant public key should match");
//     assert.equal(agreement.landlord_public_key, landlord, "Landlord public key should match");
//   });
  
});