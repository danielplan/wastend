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
    User ->> UserController: registerController(req, res)
    UserController ->> UserService: registerUser(name, email, password)
    activate UserService
    UserService ->> AuthHelpers: encryptPassword(password)
    AuthHelpers ->> UserService: passwordHash
    UserService ->> UserModel: new User(name, email, password)
    UserService ->> UserModel: save()
    UserModel ->> UserModel: validate()
    UserService ->> AuthService: createSession(user)
    activate AuthService
    AuthService ->> SessionModel: new Session(userId)
    AuthService ->> SessionModel: save()
    SessionModel -->> AuthService: Tokens
    AuthService -->> UserService: Tokens
    deactivate AuthService
    UserService -->> UserController: Tokens
    deactivate UserService
    UserController -->> User: Tokens
```

## Household Management

### Create household

```mermaid
sequenceDiagram
    actor User
    User ->> HouseholdController: createHouseholdController(req, res)
    HouseholdController ->> HouseholdService: createHousehold(name, userId)
    activate HouseholdService
    HouseholdService ->> Household: new Household(req.household)
    HouseholdService ->> Household: save()
    Household ->> Household: validate()
    HouseholdService ->> Household: addUser(user)
    HouseholdService -->> HouseholdController: Household
    deactivate HouseholdService
    HouseholdController -->> User: Household
```

### Add user to household

```mermaid
sequenceDiagram
    actor User
    User ->> HouseholdController: joinHouseholdController(req, res)
    HouseholdController ->> HouseholdService: joinHousehold(userId, householdId)
    activate HouseholdService
    HouseholdService ->> Household: get(householdId)
    HouseholdService ->> Household: addUser(userId)
    HouseholdService -->> HouseholdController: Household
    deactivate HouseholdService
    HouseholdController -->> User: Household
```

## Inventory Management

### Add groceries

```mermaid
sequenceDiagram
    actor User
    User ->> InventoryController: addGroceryController(req, res)
    InventoryController ->> InventoryService: addGrocery(name, householdId, idealAmount, unit, amount)
    activate InventoryService
    InventoryService ->> GroceryService: getGrocery(name)
    activate GroceryService
    GroceryService ->> Grocery: getByName(name)
    alt Grocery does not exist yet
        GroceryService ->> Grocery: new Grocery(name)
        GroceryService ->> Grocery: save()
    end
    GroceryService -->> InventoryService: Grocery
    deactivate GroceryService
    InventoryService ->> Stock: new Stock(amount, householdId, groceryId, idealAmount, unit)
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
    InventoryService ->> Stock: getForHousehold(groceryId, householdId)
    InventoryService ->> Stock: setAmount(amount)
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
