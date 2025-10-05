
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { register } = require('./controllers/authController.js');
const { getUser } = require('./controllers/userController.js');
const { getMasks, getMaskInstructions, getMask } = require('./controllers/maskController.js');
const { getVideos, getVideo } = require('./controllers/videoController.js');
const { updateProfile } = require('./controllers/profileController.js');

require('dotenv').config();
const prisma = require('./prisma');
const {
  loginAdmin,
  createMask,
  updateMask,
  deleteMask,
  createVideo,
  updateVideo,
  deleteVideo,
  getUsers,
  updateUser,
  deleteUser,
  createAdmin,
  createFeature,
  updateFeature,
  deleteFeature,
  createReview,
  updateReview,
  deleteReview,
  getReviews,
  getFeature,
  getSettings,
  updateSetting,
  sendGlobalMessage,
} = require('./controllers/adminController.js');
require('./bot');
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());

// Публичные эндпоинты
app.post('/api/register', register);
app.get('/api/user/:telegramId', getUser);
app.get('/api/masks/:id', getMask);
app.get('/api/masks', getMasks);
app.get('/api/masks/:id/instructions', getMaskInstructions);
app.get('/api/videos', getVideos);
app.get('/api/videos/:id', getVideo); // New route
app.post('/api/profile', updateProfile);
// routes/profile.js или routes/user.js
app.get('/api/user/:telegramId/masks', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        userMasks: {
          include: {
            mask: {
              include: {
                features: true,
                reviews: true,
                ExtraField: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const masks = user.userMasks.map((userMask) => userMask.mask);
    res.json(masks);
  } catch (error) {
    console.error('Get user masks error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/user/:telegramId/add-mask', async (req, res) => {
  const { telegramId } = req.params;
  const { maskId } = req.body;

  if (!maskId) return res.status(400).json({ error: 'maskId is required' });

  const user = await prisma.user.findUnique({ where: { telegramId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const mask = await prisma.mask.findUnique({ where: { id: maskId } });
  if (!mask) return res.status(404).json({ error: 'Mask not found' });

  // Проверка: не добавлена ли уже
  const existing = await prisma.userMask.findUnique({
    where: {
      userId_maskId: {
        userId: user.id,
        maskId: mask.id,
      },
    },
  });
  if (existing) return res.status(400).json({ error: 'Mask already added' });

  const userMask = await prisma.userMask.create({
    data: {
      userId: user.id,
      maskId: mask.id,
    },
  });

  res.json(userMask);
});

// Админские эндпоинты
app.post('/api/admin/login', loginAdmin);
app.post('/api/admin/create', createAdmin);
app.post('/api/admin/masks', createMask);
app.put('/api/admin/masks/:id', updateMask);
app.delete('/api/admin/masks/:id', deleteMask);
app.post('/api/admin/videos', createVideo);
app.put('/api/admin/videos/:id', updateVideo);
app.delete('/api/admin/videos/:id', deleteVideo);
app.get('/api/admin/users', getUsers);
app.put('/api/admin/users/:telegramId', updateUser);
app.delete('/api/admin/users/:telegramId', deleteUser);
app.post('/api/admin/features', createFeature);
app.get('/api/admin/features', getFeature);
app.put('/api/admin/features/:id', updateFeature);
app.delete('/api/admin/features/:id', deleteFeature);
app.post('/api/admin/reviews', createReview);
app.get('/api/admin/reviews', getReviews);
app.put('/api/admin/reviews/:id', updateReview);
app.delete('/api/admin/reviews/:id', deleteReview);


app.get('/api/admin/settings', getSettings);
app.post('/api/admin/settings', updateSetting);
app.post('/api/admin/send-message', sendGlobalMessage);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
