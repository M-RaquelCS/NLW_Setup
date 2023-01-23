import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
    log: ['query']
}); //conexão com o banco de dados