# 📋 Документация API - Входные и выходные данные

## 🔍 Анализ проблем в бэкенде

### ✅ **Работающие эндпоинты:**

#### 1. **GET /api/masks** - Получение всех масок

**Входные данные:** Нет
**Выходные данные:**

```json
[
  {
    "id": 5,
    "name": "BASE",
    "instructions": "Сварочная маска хамелеон FITSIZ STARTER BASE",
    "imageUrl": "https://...",
    "price": "1 021,38 ₽",
    "weight": "",
    "viewArea": "94x30 мм",
    "sensors": 2,
    "power": "DIN 4",
    "shadeRange": "DIN 4/11",
    "material": "Starter",
    "description": "FSC-B101",
    "link": null,
    "installment": null,
    "size": null,
    "days": null,
    "batteryIndicator": "",
    "hdColorTech": "",
    "memoryModes": "",
    "weldingTypes": "MMA, MIG/MAG",
    "gradientFunction": "",
    "testButton": "",
    "sFireProtection": "",
    "delayAdjustment": "",
    "sensitivityAdjustment": "",
    "operatingTemp": "от -10°C до +55°C",
    "opticalClass": "",
    "responseTime": "",
    "headband": "",
    "packageHeight": "",
    "packageLength": "",
    "packageWidth": "",
    "features": [],
    "reviews": [],
    "ExtraField": []
  }
]
```

#### 2. **GET /api/masks/:id** - Получение конкретной маски

**Входные данные:** `id` (параметр URL)
**Выходные данные:** Объект маски с полной информацией

#### 3. **GET /api/masks/:id/instructions** - Получение инструкций

**Входные данные:** `id` (параметр URL)
**Выходные данные:**

```json
{
  "instructions": "Сварочная маска хамелеон FITSIZ STARTER BASE"
}
```

#### 4. **GET /api/videos** - Получение видео

**Входные данные:** Нет
**Выходные данные:**

```json
[
  {
    "id": 2,
    "title": "Как настроить сварочную маску ELEMENT STATIC?",
    "url": "<iframe src=\"https://vk.com/video_ext.php?...\"></iframe>",
    "description": null,
    "duration": "07:05",
    "thumbnailUrl": "https://i.pinimg.com/..."
  }
]
```

#### 5. **POST /api/register** - Регистрация пользователя

**Входные данные:**

```json
{
  "telegramId": "string (обязательно)",
  "firstName": "string (опционально)"
}
```

**Выходные данные:**

```json
{
  "id": 51,
  "telegramId": "test123",
  "firstName": "Test",
  "phone": null,
  "email": null,
  "isBotAvailable": false,
  "quiz": false,
  "createdAt": "2025-10-19T02:11:41.848Z"
}
```

#### 6. **GET /api/user/:telegramId** - Получение пользователя

**Входные данные:** `telegramId` (параметр URL)
**Выходные данные:** Объект пользователя

#### 7. **POST /api/user/:telegramId/add-mask** - Добавление маски пользователю

**Входные данные:**

```json
{
  "maskId": "number (обязательно)"
}
```

**Выходные данные:**

```json
{
  "id": 2,
  "userId": 51,
  "maskId": 5
}
```

#### 8. **GET /api/user/:telegramId/masks** - Получение масок пользователя

**Входные данные:** `telegramId` (параметр URL)
**Выходные данные:** Массив масок пользователя

### ✅ **Дополнительные работающие эндпоинты:**

#### 9. **POST /api/profile** - Обновление профиля

**Входные данные:**

```json
{
  "telegramId": "string (обязательно)",
  "firstName": "string (опционально)",
  "phone": "string (опционально)",
  "email": "string (опционально)",
  "maskId": "number (опционально)",
  "quiz": "boolean (опционально)",
  "add": "boolean (опционально)"
}
```

**Выходные данные:**

```json
{
  "id": 51,
  "telegramId": "test123",
  "firstName": "Updated Name",
  "phone": "+1234567890",
  "email": null,
  "isBotAvailable": true,
  "quiz": false
}
```

#### 10. **POST /api/admin/login** - Вход админа

**Входные данные:**

```json
{
  "username": "string (обязательно)",
  "password": "string (обязательно)"
}
```

**Выходные данные (при неверных данных):**

```json
{
  "error": "Invalid credentials"
}
```

#### 11. **GET /api/admin/users** - Получение пользователей (⚠️ БЕЗ АВТОРИЗАЦИИ!)

**Входные данные:** Нет
**Выходные данные:**

```json
[
  {
    "id": 90,
    "telegramId": "796810417",
    "firstName": "Катюша",
    "isBotAvailable": true
  }
]
```

#### 12. **GET /api/admin/settings** - Получение настроек (⚠️ БЕЗ АВТОРИЗАЦИИ!)

**Входные данные:** Нет
**Выходные данные:**

```json
[
  {
    "key": "TG_MESSAGE_ON_ADD_MASK",
    "value": null
  }
]
```

### ⚠️ **Критические проблемы безопасности:**

#### 1. **Отсутствие авторизации в админских эндпоинтах**

**Проблема:** Все админские эндпоинты доступны без авторизации
**Риск:** Высокий - любой может получить доступ к админским функциям
**Решение:** Добавить middleware авторизации для всех `/api/admin/*` эндпоинтов

### 🔧 **Рекомендации по исправлению:**

#### 1. **Исправить middleware clearPreparedStatements**

```javascript
// Проблема: middleware может блокировать запросы
// Решение: добавить обработку ошибок
async function clearPreparedStatementsMiddleware(req, res, next) {
  try {
    // логика очистки
    next();
  } catch (error) {
    console.warn("Middleware error:", error.message);
    next(); // продолжаем выполнение
  }
}
```

#### 2. **Добавить валидацию данных**

```javascript
// Добавить проверку типов данных
const validateProfileData = (data) => {
  if (data.phone && typeof data.phone !== "string") {
    throw new Error("Phone must be a string");
  }
  if (data.email && typeof data.email !== "string") {
    throw new Error("Email must be a string");
  }
  return true;
};
```

#### 3. **Улучшить обработку ошибок**

```javascript
// Добавить детальное логирование
exports.updateProfile = async (req, res) => {
  try {
    console.log("Profile update request:", req.body);
    // логика обновления
  } catch (error) {
    console.error("Profile update error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });
    res.status(500).json({ error: error.message });
  }
};
```

#### 4. **Проверить безопасность**

- Добавить rate limiting
- Валидировать все входные данные
- Использовать HTTPS в продакшн
- Добавить CORS настройки

### 📊 **Статистика API:**

- **Всего эндпоинтов:** 20+
- **Работающих:** 12
- **Проблемных:** 0
- **Админских:** 12 (⚠️ БЕЗ АВТОРИЗАЦИИ!)
- **Публичных:** 8

### 🎯 **Приоритеты исправления:**

1. **КРИТИЧНО:** Добавить авторизацию для всех админских эндпоинтов
2. **Высокий:** Добавить валидацию входных данных
3. **Высокий:** Добавить rate limiting
4. **Средний:** Улучшить обработку ошибок
5. **Низкий:** Добавить логирование запросов
