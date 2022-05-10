# User stories

This section defines the user stories of wastend. They are later used to define the features of the application.

## User management
### As a user I want to create an account so that I can use the application.
A user can register using an email address, name and password. Also other means
of registration are possible.

### As a user I want to create households so that I can use the application
A user should be able to create a new household giving a name. The household
is assigned a unique code, which can be used to join.

### As a user I want to join households so that I can use the application
Using a household-code, users can join a household.


## Inventory management

### As a user I can add groceries to the inventory so that I can manage them.
Using a name, initial stock value, ideal stock value (optional) and category, users can add new groceries to the inventory of a
certain household.

### As a user I can manipulate groceries in their inventory so that their stock value changes.
Using a new stock value, groceries stock value can be changed.

### As a user I can search for groceries using so that I can find them easily.
Using a part of a name, the application lets the user search for groceries.


## Shopping list

### As a user I can generate a current shopping list so that I know what I have to buy.
The application lists all the current items that are low on stock.

### As a user I can remove items from the shopping list so that I know what I have bought.
The application lets the user remove inventory items from the shopping list by giving an approximate amount bought.

### As a user I can search for an item in the shopping list so that I can find them easily.
The shopping list allows users to search for items using parts of their names.

### As a user I can filter for items so that I can search for items depending on certain criteria.
Using categories and/or households, users can search for groceries so that they can buy certain items in certain shops for certain
households.


## Recipes

### As a user I can find recipes so that I know what I could cook.
Depending on the current stock amount of groceries, the application suggests recipes.
