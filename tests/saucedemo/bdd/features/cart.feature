Feature: Cart
  As a logged in customer
  I want to manage products in my cart
  So that I can buy what I need

  Background:
    Given I am logged in as a standard user

  Scenario: Adding a product to the cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"

  Scenario: Viewing an added product on the cart page
    Given I add "Sauce Labs Backpack" to the cart
    When I go to the cart
    Then the cart should contain "Sauce Labs Backpack"

  Scenario: Removing a product from the cart
    Given I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    When I remove "Sauce Labs Backpack" from the cart
    Then the cart should be empty
