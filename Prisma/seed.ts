import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
const brand = await prisma.brand.upsert({
where: { name: 'ExampleBrand' },
update: {},
create: { name: 'ExampleBrand' }
})

const sneaker = await prisma.sneaker.create({
data: {
name: 'Zoom Runner',
slug: 'zoom-runner',
brandId: brand.id,
description: 'Lightweight runner',
images: { create: [{ url: 'https://placehold.co/600x400' }] },
skus: {
create: [
{ skuCode: 'ZR-9-US-9', size: '9', color: 'White', price: 120 },
{ skuCode: 'ZR-9-US-10', size: '10', color: 'White', price: 120 }
]
}
}
})

const warehouse = await prisma.warehouse.upsert({
where: { name: 'Main Warehouse' },
update: {},
create: { name: 'Main Warehouse', address: '123 Sneaker St' }
})

// create inventories for each SKU
for (const sku of await prisma.sKU.findMany({ where: { sneakerId: sneaker.id } })){
await prisma.inventory.createMany({
data: [
{ skuId: sku.id, warehouseId: warehouse.id, quantity: 20 }
],
skipDuplicates: true
})
}

console.log('Seed complete')
}

main()
.catch(e => { console.error(e); process.exit(1) })
.finally(() => prisma.$disconnect())
