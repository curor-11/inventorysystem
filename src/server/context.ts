import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'

const prisma = new PrismaClient()

export async function createContext({ req }: { req: NextApiRequest }){
// Simple API-key style auth for now
const apiKey = req.headers['x-api-key'] || req.query.api_key
const isDevKey = apiKey === process.env.APP_API_KEY
return { prisma, apiKey, isDevKey }
}

export type Context = Awaited<ReturnType<typeof createContext>>
