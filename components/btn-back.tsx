'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function BtnBack() {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };
  return (
    <>
      <button
        onClick={onCloseClick}
        className="absolute max-w-screen-sm right-5 top-5 text-neutral-200"
      >
        <XMarkIcon className="size-10" />
      </button>
    </>
  );
}
