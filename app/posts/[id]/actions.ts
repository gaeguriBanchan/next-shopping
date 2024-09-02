'use server';

import db from '@/lib/db';
import getSession from '@/lib/session';
import { revalidateTag } from 'next/cache';

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}
export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export const saveComment = async (payload: string, postId: number) => {
  const session = await getSession();
  await db.comment.create({
    data: {
      payload,
      postId,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
};
