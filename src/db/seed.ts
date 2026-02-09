import db from '.';
import { CategoryTable, ProductTable } from './schema';
import slugify from 'slugify';

export async function main() {
  //  seed categories
  const productCategories = [
    'Mobile & Wearable Tech',
    'Drones & Cameras',
    'Headphones & Speakers',
    'Computers',
    'Tablets',
    'TV & Home Cinema',
  ];
  const categoryMap: Record<string, string> = {};

  for (const name of productCategories) {
    const [category] = await db
      .insert(CategoryTable)
      .values({ name })
      .returning();
    categoryMap[name] = category.id;
  }

  //   seed products
  await db.insert(ProductTable).values([
    {
      name: 'sai',
      slug: slugify('sai', { lower: true, strict: true }),
      priceInCents: 200,
      body: 'asd;flkasdjf',
      categoryId: categoryMap['Tablets'],
    },
    {
      name: 'haru',
      slug: slugify('haru', { lower: true, strict: true }),
      priceInCents: 200,
      body: 'ads;flkjadsf',
      categoryId: categoryMap['Drones & Cameras'],
    },
  ]);
}

main();
