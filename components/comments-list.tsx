'use client';

import { saveComment } from '@/app/posts/[id]/actions';
import { initialComments } from '@/app/posts/[id]/page';
import { formatToTimeAgo } from '@/lib/utils';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ICommentsList {
  initialComments: initialComments;
  userId: number;
  postId: number;
  username: string;
  avatar: string;
}

const CommentsList = ({
  initialComments,
  userId,
  username,
  avatar,
  postId,
}: ICommentsList) => {
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState('');
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setComment(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: comment,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    ]);
    await saveComment(comment, postId);
    setComment('');
  };
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment.id} className={`flex items-start gap-5`}>
          <div className="w-2/5 flex flex-col items-center gap-1">
            {comment.user.avatar ? (
              <Image
                src={comment.user.avatar!}
                alt={comment.user.username}
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
            ) : (
              <div className="size-8 bg-neutral-700 rounded-full" />
            )}
            <span className="text-xs">{comment.user.username}</span>
          </div>
          <div className={`flex flex-col gap-1 w-3/5`}>
            <span className={`rounded-md`}>{comment.payload}</span>
            <span className="text-xs">
              {formatToTimeAgo(comment.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <div className="fixed bottom-5 w-5/6 max-w-screen-sm">
        <form className="flex relative" onSubmit={onSubmit}>
          <input
            className="w-full h-10 rounded-full bg-transparent px-5 transition
        ring-2 ring-neutral-200 focus:ring-4 focus:ring-neutral-50 focus:outline-none border-none placeholder:text-neutral-400"
            required
            onChange={onChange}
            type="text"
            name="comment"
            placeholder="Write a comment"
          />
          <button>
            <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsList;
