Feature: Checkout
  As a customer with items in my cart
  I want to complete the checkout process
  So that I receive my order

  Background:
    Given I am logged in as a standard user
    And I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I start the checkout

  Scenario: Completing checkout with valid information
    When I fill in my checkout information as "John", "Doe", "12345"
    And I continue to the overview
    And I finish the order
    Then I should see the order confirmation

  Scenario: Checkout fails when first name is missing
    When I fill in my checkout information as "", "Doe", "12345"
    And I continue to the overview
    Then I should see the error "First Name is required"
