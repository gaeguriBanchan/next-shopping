import BtnBack from '@/components/btn-back';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { formatToWon } from '@/lib/utils';
import { getCachedProduct, getIsOwner } from '@/app/products/detail/[id]/page';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProduct(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function Modal({ params }: { params: { id: string } }) {
  // await new Promise((resolve) => setTimeout(resolve, 60000));

  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <BtnBack />
      <div className="max-w-screen-sm h-2/3 flex flex-col justify-center w-full bg-gray-800 rounded-md animate-fade">
        <div className="bg-gray-700 text-gray-200 h-1/2 rounded-md flex justify-center items-center overflow-hidden">
          <div className="relative h-full w-full self-center aspect-square">
            <Image
              fill
              src={product.photo}
              className="object-cover"
              alt={product.title}
            />
          </div>
          {/* <PhotoIcon className="h-28" /> */}
        </div>
        <div className="h-1/2 flex flex-col gap-1 justify-between">
          <div className="p-5 flex items-center gap-3 border-b border-gray-700">
            <div className="size-10 overflow-hidden rounded-full">
              {product.user.avatar !== null ? (
                <Image
                  src={product.user.avatar}
                  width={40}
                  height={40}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <div>
              <h3>{product.user.username}</h3>
            </div>
          </div>
          <div className="p-5">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p>{product.description}</p>
          </div>
          <div className="w-full p-8 flex justify-between items-center max-w-screen-sm">
            <span className="font-semibold text-xl">
              {formatToWon(product.price)}원
            </span>
            {isOwner ? (
              <Link
                className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
                href={`/products/edit/${id}`}
              >
                상품 수정
              </Link>
            ) : null}
            <Link
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={``}
            >
              채팅하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
