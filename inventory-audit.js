const auditSchema = new mongoose.Schema({
    action: String,  // e.g., 'added', 'updated', 'deleted'
    details: String,
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Audit = mongoose.model('Audit', auditSchema);

// Log an audit action
async function logAuditAction(action, details, userId) {
    const audit = new Audit({ action, details, userId });
    await audit.save();
    console.log('Audit action logged');
}

// Example of logging an update to sneaker stock
async function updateSneakerStock(sneakerId, newStock, userId) {
    const sneaker = await Sneaker.findById(sneakerId);
    const oldStock = sneaker.stock;
    sneaker.stock = newStock;
    await sneaker.save();

    const details = `Updated sneaker stock for ${sneaker.name} from ${oldStock} to ${newStock}`;
    await logAuditAction('updated', details, userId);
}
