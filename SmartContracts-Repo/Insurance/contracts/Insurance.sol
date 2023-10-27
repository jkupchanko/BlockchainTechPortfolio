// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Insurance {
    
    enum CoverageType { MinimumCoverage, MediumCoverage, FullCoverage }
    enum ClaimComplaint {
        Non_Fault,       // The policyholder is not at fault for the incident.
        Fault,           // The policyholder is at fault for the incident.
        Theft,           // The claim is related to theft or burglary.
        AccidentalDamage, // The claim is due to accidental damage.
        Fire,            // The claim is related to fire damage.
        NaturalDisaster,  // The claim is related to damage caused by a natural disaster.
        MedicalExpense,   // The claim involves medical expenses (e.g., health insurance).
        Other            // For other types of claims.
    }

    struct Policy {
        address customer;
        uint256 premiumAmount; // Ether
        uint256 coverageDuration; // Months
        CoverageType coverageType; // Add more policy-related data here
    }

    struct ClaimInfo {
        address customer;
        CoverageType coverageType; // Customer Coverage
        ClaimComplaint claimComplaint; // Customer ClaimOption
    }

    Policy[] public policies;
    ClaimInfo[] public complaint;

    event PolicyPurchased(address owner, uint256 policy, uint256 premiumAmount);
    event ClaimFiled(address owner, string complaintIssue, string explanation);
    event PolicyCanceled(address owner, uint256 policySelection, uint256 _premiumAmountToRefund);

    address public owner;

    mapping(address => uint256) public balances;
    mapping(address => bool) public quotedPolicy;
    mapping(address => bool) public activePolicy;

    constructor() {
        owner = msg.sender;
        balances[owner] += 10 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function quotePolicy(uint256 _coverageDuration, CoverageType _CoverageType) public {
        uint256 basePrice;
        uint256 coverageMultiplier;

        if (_CoverageType == CoverageType.MinimumCoverage) {
            basePrice = 0.001 ether;  
            coverageMultiplier = 0.002 ether;  
        } else if (_CoverageType == CoverageType.MediumCoverage) {
            basePrice = 0.002 ether;  
            coverageMultiplier = 0.004 ether;  
        } else if (_CoverageType == CoverageType.FullCoverage) {
            basePrice = 0.003 ether;  
            coverageMultiplier = 0.006 ether;  
        } else {
            revert("Error, Wrong Input!");
        }

        uint256 totalPremium = (basePrice + coverageMultiplier * _coverageDuration);

        Policy memory newPolicy = Policy({
            customer: msg.sender,
            premiumAmount: totalPremium,
            coverageDuration: _coverageDuration,
            coverageType: _CoverageType
        });

        policies.push(newPolicy);
        quotedPolicy[msg.sender] = true; 
        activePolicy[msg.sender] = false;
    }

    function purchasePolicy(uint256 _pickPolicy) public payable {
        require(quotedPolicy[msg.sender] == true, "You need to get a quote before purchasing!");
        require(_pickPolicy < policies.length, "Error: Policy does not exist");
        require(balances[owner] >= policies[_pickPolicy].premiumAmount, "Error: Insufficient funds");

        balances[owner] -= policies[_pickPolicy].premiumAmount;
        emit PolicyPurchased(msg.sender, _pickPolicy, policies[_pickPolicy].premiumAmount);
        quotedPolicy[msg.sender] = false;
        activePolicy[msg.sender] = true;

    }
    
    function cancelPolicy(uint256 _policySelection) public {
        require(activePolicy[msg.sender] == true, "The policy needs to be active!");
        require(_policySelection < policies.length, "Error: Policy does not exist");

        uint256 premiumAmountToRefund = policies[_policySelection].premiumAmount;
        activePolicy[msg.sender] = false;
        balances[owner] += premiumAmountToRefund;
        emit PolicyCanceled(msg.sender, _policySelection, premiumAmountToRefund);
}


    function fileComplain(string memory _complaintIssue, string memory _explanation) public {
        require(activePolicy[msg.sender], "You need to purchase a policy to make a complaint!");

        ClaimInfo memory newComplaint = ClaimInfo({
            customer: msg.sender,
            coverageType: policies[policies.length - 1].coverageType, 
            claimComplaint: ClaimComplaint.Other  
        });

        complaint.push(newComplaint);
        emit ClaimFiled(msg.sender, _complaintIssue, _explanation);

    }

    receive() external payable {
        revert("This contract does not accept direct payments");
    }
}

