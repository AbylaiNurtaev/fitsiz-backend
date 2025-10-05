const prisma = require("../prisma");

exports.getMasks = async () => {
  return await prisma.mask.findMany({
    include: {
      features: true,
      reviews: true,
    },
  });
};

exports.getMaskInstructions = async (id) => {
  const mask = await prisma.mask.findUnique({
    where: { id: parseInt(id) },
    include: {
      features: true,
      reviews: true,
    },
  });
  return mask ? {
    instructions: mask.instructions,
    imageUrl: mask.imageUrl,
    price: mask.price,
    weight: mask.weight,
    viewArea: mask.viewArea,
    sensors: mask.sensors,
    power: mask.power,
    shadeRange: mask.shadeRange,
    material: mask.material,
    features: mask.features,
    reviews: mask.reviews,
  } : null;
};