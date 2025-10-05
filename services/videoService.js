const prisma = require("../prisma");

exports.getVideos = async () => {
  return await prisma.video.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      description: true,
      duration: true,
      thumbnailUrl: true,
    },
  });
};