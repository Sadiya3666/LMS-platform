import { prisma } from "../../config/db";

export const getSubjects = async (page: number, pageSize: number, query?: string) => {
  const where = {
    is_published: true,
    ...(query ? { title: { contains: query } } : {}),
  };

  const [total, subjects] = await Promise.all([
    prisma.subject.count({ where }),
    prisma.subject.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return { total, subjects };
};

export const getSubjectById = async (id: bigint) => {
  return prisma.subject.findUnique({
    where: { id },
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
  });
};

export const getSubjectTree = async (subjectId: bigint) => {
  return prisma.subject.findUnique({
    where: { id: subjectId },
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
  });
};
