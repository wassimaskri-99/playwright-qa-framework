Feature: Login
  As a SauceDemo customer
  I want to log into my account
  So that I can start shopping

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I log in with valid credentials
    Then I should be redirected to the inventory page

  Scenario: Login fails with an incorrect password
    Given I am on the login page
    When I log in with password "wrong_password"
    Then I should see the error "Username and password do not match"

  Scenario: Login fails for a locked out account
    Given I am on the login page
    When I log in as a locked out user
    Then I should see the error "Sorry, this user has been locked out"
