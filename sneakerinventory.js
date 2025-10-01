// sneakerInventory.js

const readline = require('readline');

// In-memory sneaker data
const sneakers = [
  {
    id: 1,
    name: "Nike Air Jordan 1",
    sku: "AJ1-001",
    lowStockThreshold: 2,
    variants: [
      { size: 8, quantity: 5 },
      { size: 9, quantity: 1 },
      { size: 10, quantity: 0 },
    ]
  },
  {
    id: 2,
    name: "Adidas Yeezy Boost 350",
    sku: "YZY-350",
    lowStockThreshold: 1,
    variants: [
      { size: 8, quantity: 0 },
      { size: 9, quantity: 2 },
    ]
  }
];

// Get sneakers with low or out-of-stock sizes
function getLowStockItems() {
  const lowStock = [];

  sneakers.forEach(sneaker => {
    sneaker.variants.forEach(variant => {
      if (variant.quantity <= sneaker.lowStockThreshold) {
        lowStock.push({
          name: sneaker.name,
          size: variant.size,
          quantity: variant.quantity
        });
      }
    });
  });

  return lowStock;
}

// Update stock by size
function updateStock(sneakerId, size, change) {
  const sneaker = sneakers.find(s => s.id === sneakerId);
  if (!sneaker) return console.log("Sneaker not found.");

  const variant = sneaker.variants.find(v => v.size === size);
  if (!variant) return console.log("Size not found.");

  variant.quantity += change;
  console.log(`Updated ${sneaker.name} size ${size} to quantity: ${variant.quantity}`);
}

// CLI for demo
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Sneaker Inventory System");
console.log("1. Show Low Stock Items");
console.log("2. Update Stock Quantity");
console.log("3. Exit");

rl.on("line", function(line) {
  if (line === "1") {
    const lowStock = getLowStockItems();
    console.log("\n⚠️ Low or Out-of-Stock Items:");
    lowStock.forEach(item => {
      console.log(`- ${item.name} (Size ${item.size}) → Qty: ${item.quantity}`);
    });
    console.log("\nChoose next option:");
  }

  if (line === "2") {
    rl.question("Enter sneaker ID: ", id => {
      rl.question("Enter size: ", size => {
        rl.question("Enter quantity change (e.g., -1 or +2): ", change => {
          updateStock(Number(id), Number(size), Number(change));
          console.log("\nChoose next option:");
        });
      });
    });
  }

  if (line === "3") {
    console.log("Exiting...");
    rl.close();
  }
});

