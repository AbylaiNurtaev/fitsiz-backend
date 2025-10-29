require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

let prisma

// Конфигурация для работы с Supabase pooler
function getDatabaseUrl() {
  const baseUrl = process.env.DATABASE_URL
  
  if (!baseUrl) {
    throw new Error('DATABASE_URL is not defined')
  }
  
  // Если URL уже содержит параметры, используем его как есть
  if (baseUrl.includes('?')) {
    return baseUrl
  }
  
  const url = new URL(baseUrl)
  
  // Всегда отключаем prepared statements через pgbouncer=true,
  // так как на проде может использоваться PgBouncer/Pooler любого провайдера
  url.searchParams.set('pgbouncer', 'true')
  url.searchParams.set('connection_limit', '1')
  url.searchParams.set('pool_timeout', '20')
  url.searchParams.set('sslmode', 'require')
  
  return url.toString()
}

// Создание Prisma Client с правильными настройками для pooler
function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ['error'],
    errorFormat: 'minimal',
    // Отключаем prepared statements для работы с pooler
    __internal: {
      engine: {
        preparedStatements: false
      }
    }
  })
}

// Простая инициализация Prisma Client
const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient()
}

prisma = globalForPrisma.prisma

// Простая функция для безопасного выполнения запросов
async function executeWithRetry(operation, maxRetries = 5) {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      // Если это ошибка подключения - ждем и повторяем (P1001, P2024, Can't reach ...)
      if (error.code === 'P1001' || error.code === 'P2024' || (typeof error.message === 'string' && error.message.includes("Can't reach database server"))) {
        const delayMs = Math.min(5000, 500 * Math.pow(2, i))
        console.warn(`Database connection error, retry ${i + 1}/${maxRetries} after ${delayMs}ms`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
        continue
      }
      
      // Для других ошибок не повторяем
      throw error
    }
  }
  
  throw lastError
}

// Расширяем prisma клиент функцией безопасного выполнения
prisma.safeExecute = executeWithRetry

// Простая проверка подключения
async function testConnection() {
  try {
    await executeWithRetry(async () => {
      await prisma.$queryRaw`SELECT 1 as test`
    })
    console.log('✅ Database connection successful')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  }
}

// Тестируем подключение при старте
testConnection()

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down gracefully...`)
  
  try {
    await prisma.$disconnect()
    console.log('Database disconnected')
  } catch (error) {
    console.error('Error during shutdown:', error.message)
  } finally {
    process.exit(0)
  }
}

// Обрабатываем сигналы завершения
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

module.exports = prisma;
