import { prisma } from "../../config/db";

export const getVideoWithContext = async (videoId: bigint) => {
  return prisma.video.findUnique({
    where: { id: videoId },
    include: {
      section: {
        include: {
          subject: {
            include: {
              sections: {
                include: {
                  videos: {
                    orderBy: { order_index: "asc" },
                  },
                },
                orderBy: { order_index: "asc" },
              },
            },
          },
        },
      },
    },
  });
};
