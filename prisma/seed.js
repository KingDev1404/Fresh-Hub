const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create regular user
  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'BUYER',
    },
  });
  console.log('Regular user created:', user.email);

  // Create some products
  const products = [
    {
      name: 'Fresh Carrots',
      description: 'Locally grown organic carrots. Sweet and crunchy, perfect for salads, juicing, or cooking.',
      price: 1.99,
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
      category: 'Vegetables',
    },
    {
      name: 'Organic Apples',
      description: 'Sweet and crisp organic apples. Freshly picked from local orchards.',
      price: 2.49,
      imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
      category: 'Fruits',
    },
    {
      name: 'Fresh Spinach',
      description: 'Nutrient-rich spinach leaves. Perfect for salads, smoothies, or cooking.',
      price: 3.99,
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
      category: 'Vegetables',
    },
    {
      name: 'Ripe Bananas',
      description: 'Sweet and energy-packed bananas. Great for smoothies, baking, or as a quick snack.',
      price: 1.29,
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
      category: 'Fruits',
    },
    {
      name: 'Red Potatoes',
      description: 'Versatile red potatoes with a smooth texture. Ideal for roasting, mashing, or salads.',
      price: 0.99,
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
      category: 'Vegetables',
    },
    {
      name: 'Fresh Strawberries',
      description: 'Juicy and sweet strawberries. Perfect for desserts or eating fresh.',
      price: 4.99,
      imageUrl: 'https://images.unsplash.com/photo-1543158181-e6f9f6712055',
      category: 'Fruits',
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { 
        // Since there's no unique constraint other than id, we need to find by name
        // This is just for the seed script
        id: (await prisma.product.findFirst({ where: { name: product.name } }))?.id || -1
      },
      update: product,
      create: product,
    });
    console.log('Product created:', createdProduct.name);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });