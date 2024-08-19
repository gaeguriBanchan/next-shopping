import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function test() {
  // <Create>
  // const token = await db.sMSToken.create({
  //   data: {
  //     token: '121212',
  //     user: {
  //       connect: {
  //         id: 1,
  //       },
  //     },
  //   },
  // });
  // <Find>
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
    },
    include: {
      user: true,
    },
  });
  console.log(token);
}

test();

export default db;
