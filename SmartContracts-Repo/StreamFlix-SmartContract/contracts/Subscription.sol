// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title StreamFlix Subscription Service
 * @dev The StreamFlix Subscription Service contract provides users with access to a premium streaming platform.
 * Users can subscribe to various membership plans, allowing them to stream a vast library of movies, TV shows,
 * documentaries, and exclusive original content. The service includes high-quality video streaming, unlimited
 * access to content, and the ability to watch on multiple devices.
 *
 * Membership Plans:
 * - Basic Membership: Access to standard quality content with monthly or automatic payment options.
 * - Premium Membership: Access to high-definition content with monthly or automatic payment options.
 *
 * Trial Period:
 * Users enjoy a 1-day trial period where they can experience the platform's features before committing to a subscription.
 * During the trial, users can explore the content library and decide on the membership plan that suits them best.
 *
 * Payment Cycles:
 * Users can choose between standard monthly payments or automatic payments for added convenience.
 *
 * Features:
 * - Subscription management: Users can check prices, enter a trial period, purchase subscriptions, and cancel active subscriptions.
 * - Flexibility: Users can switch between membership plans and payment cycles as per their preferences.
 * - Refunds: Users can cancel subscriptions and receive refunds for the remaining period of the subscription.
 * - Security: The contract ensures secure and transparent subscription management for StreamFlix customers.
 */

contract Subscription {
    address public customer;
    mapping(address => uint256) public balances;
    enum CustomerRegister { basicMembership, premiumMembership }
    enum PaymentCycle { standardPayment, automaticPayment }

    struct Membership {
        string name;
        address customer;
        uint8 planDuration;
        PaymentCycle paymentCycle;
        CustomerRegister customerRegister;
        uint256 totalPrice;
    }

    Membership[] public memberships;
    mapping(address => bool) public activeSubscription;
    mapping(address => bool) public purchasedSubscription;
    mapping(address => bool) public trialPeriod;
    mapping(address => uint256) public trialEndTimes;

    event SubscriptionPurchased(address indexed user, uint256 totalPrice);

    modifier onlyCustomer() {
        require(msg.sender == customer, "Only the customer can call this function");
        _;
    }

    constructor(address _customer) {
        customer = _customer;
        balances[customer] += 2 ether;
    }

    function checkPrice(
        string memory _name,
        uint8 _planDuration,
        PaymentCycle _paymentCycle,
        CustomerRegister _customerRegister
    ) public onlyCustomer {
        require(activeSubscription[msg.sender] == false, "Subscription already active");
        require(trialPeriod[msg.sender] == false, "You already had a trial period!");

        uint256 basicMembership;
        uint256 premiumMembership;
        uint256 standardPayment;
        uint256 automaticPayment;

        if (_customerRegister == CustomerRegister.basicMembership && _paymentCycle == PaymentCycle.standardPayment) {
            basicMembership = 0.01 ether;
            standardPayment = 0.01 ether;
        } else if (_customerRegister == CustomerRegister.basicMembership && _paymentCycle == PaymentCycle.automaticPayment) {
            basicMembership = 0.01 ether;
            automaticPayment = 0.001 ether;
        } else if (_customerRegister == CustomerRegister.premiumMembership && _paymentCycle == PaymentCycle.standardPayment) {
            premiumMembership = 0.03 ether;
            standardPayment = 0.01 ether;
        } else if (_customerRegister == CustomerRegister.premiumMembership && _paymentCycle == PaymentCycle.automaticPayment) {
            premiumMembership = 0.03 ether;
            automaticPayment = 0.001 ether;
        } else {
            revert("Invalid selection");
        }

        uint256 result = (basicMembership + automaticPayment + standardPayment + premiumMembership) * _planDuration;

        Membership memory newMembership = Membership({
            name: _name,
            customer: msg.sender,
            planDuration: _planDuration,
            paymentCycle: _paymentCycle,
            customerRegister: _customerRegister,
            totalPrice: result
        });

        memberships.push(newMembership);
        activeSubscription[msg.sender] = true;
        purchasedSubscription[msg.sender] = false;
        trialEndTimes[msg.sender] = block.timestamp + 5 days;

        emit SubscriptionPurchased(msg.sender, result);
    }

    function purchaseSubscription(uint8 _quotedSub) public {
        require(activeSubscription[msg.sender] == true, "Subscription not active");
        require(purchasedSubscription[msg.sender] == false, "Subscription already purchased");
        require(balances[msg.sender] > 0, "Insufficient balance");

        uint256 totalPrice = memberships[_quotedSub].totalPrice;
        balances[customer] -= totalPrice;

        activeSubscription[msg.sender] = false;
        purchasedSubscription[msg.sender] = true;
        trialPeriod[msg.sender] = false;
    }

    function trialSubscription(uint8 _trialSub) public onlyCustomer {
        require(trialPeriod[msg.sender] == false, "Trial period already received");
        require(purchasedSubscription[msg.sender] == false, "Subscription already purchased");
        require(activeSubscription[msg.sender] == true, "Subscription not active");
        require(_trialSub < memberships.length, "Invalid subscription selection");

        trialPeriod[msg.sender] = true;
        trialEndTimes[msg.sender] = block.timestamp + 5 days;

        Membership storage selectedMembership = memberships[_trialSub];
        require(selectedMembership.customer == msg.sender, "You do not have access to this subscription");
        emit SubscriptionPurchased(msg.sender, selectedMembership.totalPrice);
}

    function cancelSubscription(uint8 _activeSub) public {
        require(purchasedSubscription[msg.sender] == true, "No active subscription to cancel");
        require(balances[msg.sender] > 0, "Insufficient balance");

        uint256 refundAmount = memberships[_activeSub].totalPrice;

        balances[msg.sender] += refundAmount;

        activeSubscription[msg.sender] = false;
        purchasedSubscription[msg.sender] = false;
        trialPeriod[msg.sender] = false;
    }
}
