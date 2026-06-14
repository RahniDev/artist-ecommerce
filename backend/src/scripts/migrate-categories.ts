import mongoose from "mongoose";
import { Product } from "../modules/product/product.model.ts";
import { Category } from "../modules/category/category.model.ts";
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.DATABASE!);

  const products = await Product.find({
    subcategory: { $exists: true, $ne: null }
  });

  for (const product of products) {
    // subcategory is guaranteed to exist by the query, assert non-null for TS
    product.category = product.subcategory!;
    product.subcategory = null;
    await product.save();
  }

  console.log(`Updated ${products.length} products`);

  const result = await Category.updateMany(
    { parent: { $ne: null } },
    { $set: { parent: null } }
  );

  console.log(`Promoted ${result.modifiedCount} categories`);

  await mongoose.disconnect();
}

migrate()
  .then(() => {
    console.log("Migration complete");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });