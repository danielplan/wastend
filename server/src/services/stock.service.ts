import Stock from '../models/stock.model';
import Grocery from '../models/grocery.model';

export async function getStock(name: string, amount: number, unit: string, householdId: string, idealAmount: number, groceryId: string): Promise<Grocery> {
    const stock = await Stock.getForHousehold(groceryId, householdId);
    if (stock != null) {
        stock.fromDBObject({ amount, unit, idealAmount });
        await stock.save();
        return stock;
    }
    const newStock = new Stock({ groceryId, householdId, amount, unit, idealAmount });
    await newStock.save();
    return newStock;
}
