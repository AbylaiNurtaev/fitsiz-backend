const prisma = require("../prisma");

exports.getCatalog = async (name) => {
  return await prisma.catalogItem.findMany({
    where: name ? { name: { contains: name, mode: 'insensitive' } } : {},
    include: {
      mask: true,
      reviews: true,
    },
  });
};