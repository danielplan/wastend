# User Journeys

This section will give a deeper look into some activities that users can perform using wastend.
It will briefly show how the system handles user stories.
Backend logics are represented as Sequence Diagrams, frontend routines are
state diagrams.

## User management

### Onboarding

```mermaid
stateDiagram-v2
    state "On the landing page" as landing_page
    state "On register page" as register
    state "Data entered" as register_data
    state "Name, email and password (confirm) was given" as register_data
    state "Registration complete" as register_complete
    state "Onboarding" as onboard
    state "Show introduction on how to use the application" as onboard
    state "Create a household" as create_household
    state "Entered household data" as create_household
    state "Ready to use" as ready
    
    landing_page --> register: click register
    register --> register_data: enter data
    register_data --> register_complete: enter data
    register_complete --> onboard: show introduction information
    onboard --> create_household: click on create household
    onboard --> ready: click on join household
    create_household --> ready: created new household
```
### Registration

```mermaid
sequenceDiagram
    actor User
    User ->> UserController: POST /user/register
    UserController ->> UserService: registerUser(req)
    activate UserService
    UserService ->> AuthService: register(req.household)
    AuthService ->> User: new User(req.user)
    AuthService ->> User: save()
    UserService ->> AuthService: login(req.user)
    UserService -->> UserController: Tokens
    deactivate UserService
    UserController -->> User: Tokens
```

## Household Management

### Create household

```mermaid
sequenceDiagram
    actor User
    User ->> HouseholdController: POST /household/:householdId/join
    HouseholdController ->> HouseholdService: createHousehold(req)
    activate HouseholdService
    HouseholdService ->> HouseholdService: validateHousehold(req.household)
    HouseholdService ->> Household: new Household(req.household)
    HouseholdService ->> Household: save()
    HouseholdService ->> Household: addUser(req.user)
    HouseholdService -->> HouseholdController: Household
    deactivate HouseholdService
    HouseholdController -->> User: Household
```

### Add user to household

```mermaid
sequenceDiagram
    actor User
    User ->> HouseholdController: POST /household
    HouseholdController ->> HouseholdService: addUserToHousehold(req)
    activate HouseholdService
    HouseholdService ->> Household: get(req.householdId)
    HouseholdService ->> Household: addUser(req.user)
    HouseholdService -->> HouseholdController: Household
    deactivate HouseholdService
    HouseholdController -->> User: Household
```

## Inventory Management

### Add groceries

```mermaid
sequenceDiagram
    actor User
    User ->> InventoryController: POST /inventory
    InventoryController ->> InventoryService: addGroceryToHousehold(req)
    activate InventoryService
    InventoryService ->> GroceryService: getGrocery(req)
    activate GroceryService
    GroceryService ->> Grocery: findGrocery(req.grocery)
    alt Grocery does not exist yet
        GroceryService ->> Grocery: new Grocery(req.grocery)
        GroceryService ->> Grocery: save()
    end
    GroceryService -->> InventoryService: Grocery
    deactivate GroceryService
    InventoryService ->> Stock: new Stock(req.amount, req.household, grocery.id)
    InventoryService ->> Stock: save()
    InventoryService -->> InventoryController: Grocery
    deactivate InventoryService
    InventoryController -->> User: Grocery
```

### Update stock value

```mermaid
sequenceDiagram
    actor User
    User ->> InventoryController: POST /inventory/stock
    InventoryController ->> InventoryService: updateStock(req)
    activate InventoryService
    InventoryService ->> Stock: getForHousehold(req.groceryId, req.householdId)
    InventoryService ->> Stock: setAmount(req.amount)
    InventoryService ->> Stock: save()
    InventoryService -->> InventoryController: Amount
    deactivate InventoryService
    InventoryController -->> User: Amount
```

## Shopping list


### Retrieve shopping list

```mermaid
sequenceDiagram
    actor User
    User ->> InventoryController: GET /inventory/shopping
    InventoryController ->> InventoryService: getShoppingList(req)
    activate InventoryService
    InventoryService ->> Grocery: getLowOnStock(req.households)
    Grocery -->> InventoryService: Grocery[]
    InventoryService -->> InventoryController: Grocery[]
    deactivate InventoryService
    InventoryController -->> User: Grocery[]
```
