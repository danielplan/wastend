import Grocery from '../models/grocery.model';

export async function getGrocery(name: string): Promise<Grocery> {
    const grocery = await Grocery.getByName(name) as Grocery;
    if (grocery != null) return grocery;
    const newGrocery = new Grocery({ name });
    await newGrocery.save();
    return newGrocery;
}
