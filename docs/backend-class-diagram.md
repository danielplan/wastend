# Class Diagram (backend)

```mermaid
classDiagram
class Model {
    <<abstract>>
    -tableName: string
    -id: string
    +static get(id: string)
    +save()
    +validate(): string[]
    +toDBObject()
    +fromDBObject()
    +delete()
    -wrap(items)
}
class User {
    +id: string
    +name: string
    +email: string
    +password: string?
    +passwordHash: string
    +validate(): string[]
    +static getByEmail(email): User
}
class Session {
    +id: string
    +userId: string
    +validate(): string[]
}
class HouseholdHasUser {
    +id: string
    +userId: string
    +householdId: string
    +validate(): string[]
}
class Grocery {
    +id: string
    +name: string
    +category: Category
    +string category
    +static findGrocery(grocery)
    +static getLowOnStock()
}
class GroceryCategory {
    +id: string
    +name: string
}
class Stock {
    +id: string
    +item: string
    +amount: int
    +idealAmount: int
    +unit: string
    +static getForHousehold(household, grocery)
}
class Household {
    +id: string
    +name: string
    +addUser(userId)
    +hasAccess(userId)
    +static getForUser(userId)
    +validate(): string[]
}
class Ingredient {
    +id: string
    +amount: int
}
class Recipe {
    +id: string
    +description: string
}
class HouseholdService {
    +createHosehold(household)
    +validateHousehold(household)
    +addUserToHousehold(household, user)
}
class InventoryService {
    +addGroceryToHousehold(grocery, household)
    +updateStock(grocery, household)
}
class GroceryService {
    +getGrocery(grocery)
}
class InventoryController {
    
}
class UserController {
    
}
class HouseholdController {
    
}
Model <|-- Household
Model <|-- Stock
Model <|-- User
Model <|-- Grocery
Model <|-- GroceryCategory
Model <|-- Recipe
Model <|-- Ingredient
Model <|-- Session
Model <|-- HouseholdHasUser
Household <-- HouseholdService 
Grocery <-- GroceryService 
GroceryService <-- InventoryService 
Stock <-- InventoryService 
InventoryService <-- InventoryController 
HouseholdService <-- HouseholdController 
```