import { PrismaClient } from '@prisma/client'

// Создаём один экземпляр клиента на всё приложение.
// Как один кассовый аппарат на весь магазин — не надо открывать новый для каждого покупателя.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

export default prisma
