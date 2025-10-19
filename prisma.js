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
  
  // Для Supabase pooler - обязательные настройки
  if (baseUrl.includes('pooler.supabase.com')) {
    url.searchParams.set('pgbouncer', 'true')
    url.searchParams.set('connection_limit', '1')
    url.searchParams.set('pool_timeout', '20')
    url.searchParams.set('sslmode', 'require')
    return url.toString()
  }
  
  // Для прямого подключения
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
async function executeWithRetry(operation, maxRetries = 2) {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      // Если это ошибка подключения - ждем и повторяем
      if (error.code === 'P2024' || error.message.includes('Can\'t reach database server')) {
        console.warn(`Database connection error, retry ${i + 1}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
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
