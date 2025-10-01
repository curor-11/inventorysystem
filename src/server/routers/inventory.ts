import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const inventoryRouter = router({
list: publicProcedure
.query(async ({ ctx }) => {
const items = await ctx.prisma.inventory.findMany({
include: { sku: { include: { sneaker: true } }, warehouse: true }
})
return items
}),

adjust: publicProcedure
.input(z.object({ skuId: z.string(), warehouseId: z.string(), change: z.number(), reason: z.string().optional() }))
.mutation(async ({ input, ctx }) => {
// upsert inventory row
const inventory = await ctx.prisma.inventory.upsert({
where: { skuId_warehouseId: { skuId: input.skuId, warehouseId: input.warehouseId } },
update: { quantity: { increment: input.change } },
create: { skuId: input.skuId, warehouseId: input.warehouseId, quantity: input.change }
})

// record adjustment
await ctx.prisma.stockAdjustment.create({ data: { skuId: input.skuId, warehouseId: input.warehouseId, change: input.change, reason: input.reason } })

// audit
await ctx.prisma.auditLog.create({ data: { entity: 'inventory', action: 'adjust', details: { skuId: input.skuId, warehouseId: input.warehouseId, change: input.change, reason: input.reason } } })

return inventory
})
})
