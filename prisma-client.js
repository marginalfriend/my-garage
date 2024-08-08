import { PrismaClient } from '@prisma/client'

export const { category, product, account, role, accountRole } = new PrismaClient()