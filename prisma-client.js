import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
export const { category, product, account, role, accountRole, cart, user, image } = prisma