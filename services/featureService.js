const prisma = require("../prisma");

exports.createFeature = async (name, maskId) => {
  return await prisma.feature.create({
    data: { name, maskId: parseInt(maskId) },
  });
};

exports.updateFeature = async (id, name) => {
  return await prisma.feature.update({
    where: { id: parseInt(id) },
    data: { name },
  });
};

exports.deleteFeature = async (id) => {
  return await prisma.feature.delete({
    where: { id: parseInt(id) },
  });
};