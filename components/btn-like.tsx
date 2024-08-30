'use client';

import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import { dislikePost, likePost } from '@/app/posts/[id]/actions';

interface IBtnLike {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function BtnLike({ isLiked, likeCount, postId }: IBtnLike) {
  // useOptimistic : 서버가 늦어져도 loading이 아닌 바로 변화를 보여줄수있음.
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );
  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };
  return (
    <button
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors ${
        isLiked
          ? 'bg-orange-500 text-white border-orange-500'
          : 'hover:bg-neutral-800'
      }`}
    >
      {isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {isLiked ? (
        <span> {likeCount}</span>
      ) : (
        <span>공감하기 ({likeCount})</span>
      )}
    </button>
  );
}
