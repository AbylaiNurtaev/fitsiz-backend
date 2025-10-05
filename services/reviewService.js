const prisma = require("../prisma");

exports.createReview = async (userName, rating, comment, maskId, catalogId) => {
  return await prisma.review.create({
    data: {
      userName,
      rating,
      comment,
      createdAt: new Date(),
      mask: maskId ? { connect: { id: maskId } } : undefined,
      catalog: catalogId ? { connect: { id: catalogId } } : undefined, // если есть catalog
    },
  });
};

exports.updateReview = async (id, userName, rating, comment) => {
  return await prisma.review.update({
    where: { id: parseInt(id) },
    data: { userName, rating: parseFloat(rating), comment },
  });
};

exports.deleteReview = async (id) => {
  return await prisma.review.delete({
    where: { id: parseInt(id) },
  });
};