// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalHomeContract {

    enum ContractState { CREATED, STARTED, TERMINATED }

    struct RentalAgreement {
        uint256 home_id;
        uint256 price;
        string price_type;
        string tenant_mobile;
        string tenant_national_code;
        string landlord_mobile;
        string landlord_national_code;
        address tenant_public_key;
        address landlord_public_key;
        ContractState state;
        bool tenantSigned;
        bool landlordSigned;
    }

    mapping(address => RentalAgreement[]) public tenantAgreements;
    mapping(address => RentalAgreement[]) public landlordAgreements;

    function setRentalAgreement(
        uint256 _home_id,
        uint256 _price,
        string memory _price_type,
        string memory _tenant_mobile,
        string memory _tenant_national_code,
        string memory _landlord_mobile,
        string memory _landlord_national_code,
        address _tenant_public_key,
        address _landlord_public_key
    ) public {
        RentalAgreement memory agreement = RentalAgreement(
            _home_id,
            _price,
            _price_type,
            _tenant_mobile,
            _tenant_national_code,
            _landlord_mobile,
            _landlord_national_code,
            _tenant_public_key,
            _landlord_public_key,
            ContractState.CREATED,  // Initial state is CREATED
            false,  // tenant has not signed yet
            false   // landlord has not signed yet
        );

        tenantAgreements[_tenant_public_key].push(agreement);
        landlordAgreements[_landlord_public_key].push(agreement);
    }

    function signContractAsTenant(address _tenant_public_key, uint256 _index) public {
        RentalAgreement storage agreement = tenantAgreements[_tenant_public_key][_index];
        require(agreement.tenant_public_key == msg.sender, "Only the tenant can sign this contract.");
        require(agreement.state == ContractState.CREATED, "Contract is not in the correct state to sign.");
        
        agreement.tenantSigned = true;
        
        updateLandlordAgreement(_tenant_public_key, _index);
        
        checkAndStartContract(_tenant_public_key, _index);
    }

    function updateLandlordAgreement(address _tenant_public_key, uint256 _index) internal {
        RentalAgreement storage agreement = landlordAgreements[tenantAgreements[_tenant_public_key][_index].landlord_public_key][_index];
        agreement.tenantSigned = true;
        checkAndStartContract(_tenant_public_key, _index);
    }

    function signContractAsLandlord(address _landlord_public_key, uint256 _index) public {
        RentalAgreement storage agreement = landlordAgreements[_landlord_public_key][_index];
        require(agreement.landlord_public_key == msg.sender, "Only the landlord can sign this contract.");
        require(agreement.state == ContractState.CREATED, "Contract is not in the correct state to sign.");

        agreement.landlordSigned = true;
        
        updateTenantAgreement(_landlord_public_key, _index);
        
        checkAndStartContract(agreement.tenant_public_key, _index);
    }

    function updateTenantAgreement(address _landlord_public_key, uint256 _index) internal {
        RentalAgreement storage agreement = tenantAgreements[landlordAgreements[_landlord_public_key][_index].tenant_public_key][_index];
        agreement.landlordSigned = true;
        checkAndStartContract(agreement.tenant_public_key, _index);
    }

   function checkAndStartContract(address _tenant_public_key, uint256 _index) internal {
    RentalAgreement storage agreement = tenantAgreements[_tenant_public_key][_index];
    if (agreement.tenantSigned && agreement.landlordSigned) {
        agreement.state = ContractState.STARTED;

        RentalAgreement storage landlordAgreement = landlordAgreements[agreement.landlord_public_key][_index];
        landlordAgreement.state = ContractState.STARTED;
    }
}

    function terminateContractAsLandlord(address _landlord_public_key, uint256 _index) public {
        RentalAgreement storage agreement = landlordAgreements[_landlord_public_key][_index];
        require(agreement.landlord_public_key == msg.sender, "Only the landlord can terminate this contract.");
        require(agreement.state == ContractState.STARTED, "Contract must be started to terminate.");

        agreement.state = ContractState.TERMINATED;
    }

    function getAgreementsByTenant(address _tenantPublicKey) public view returns (RentalAgreement[] memory) {
        return tenantAgreements[_tenantPublicKey];
    }

    function getAgreementsByLandlord(address _landlordPublicKey) public view returns (RentalAgreement[] memory) {
        return landlordAgreements[_landlordPublicKey];
    }

    function getContractState(address _tenant_public_key, uint256 _index) public view returns (ContractState) {
        return tenantAgreements[_tenant_public_key][_index].state;
    }
}