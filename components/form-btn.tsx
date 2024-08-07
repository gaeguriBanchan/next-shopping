'use client';

import { useFormStatus } from 'react-dom';

interface IFormBtnProps {
  text: string;
}

export default function FormBtn({ text }: IFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="primary-btn h-10 disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-not-allowed"
    >
      {pending ? 'Loading...' : text}
    </button>
  );
}
