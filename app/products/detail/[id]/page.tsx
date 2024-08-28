import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { unstable_cache, revalidateTag } from 'next/cache';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  // await new Promise((resolve) => setTimeout(resolve, 60000));
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

// NextJs에서는 Api fetch도 이런식으로 revalidate 해줄수있다.
async function getProductApi(id: number) {
  fetch('https://api.com', {
    next: {
      revalidate: 60,
      tags: ['hello'],
    },
  });
}

const getCachedProduct = unstable_cache(getProduct, ['product-detail'], {
  tags: ['product-detail', 'xxxx'],
});

async function getProductTitle(id: number) {
  console.log('title');
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = unstable_cache(
  getProductTitle,
  ['product-title'],
  {
    tags: ['product-title', 'xxxx'],
  }
);

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    'use server';
    // revalidateTag : 태그를 공유하는 모든 cache를 revalidate.
    revalidateTag('xxxx');
  };

  const deleteProduct = async () => {
    'use server';
    await db.product.delete({
      where: {
        id,
      },
      select: null,
    });
    redirect('/products');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="relative h-1/3 w-3/4 self-center aspect-square mt-5">
        <Image
          fill
          src={product.photo}
          className="object-cover"
          alt={product.title}
        />
      </div>
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
      <div className="fixed w-full bottom-0 p-5 pb-10 bg-gray-800 flex justify-between items-center max-w-screen-sm">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          // <form action={deleteProduct}>
          //   <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
          //     Delete product
          //   </button>
          // </form>
          <form action={revalidate}>
            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
              Revalidate title cache
            </button>
          </form>
        ) : null}
        <Link
          className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          href={``}
        >
          채팅하기
        </Link>
      </div>
    </div>
  );
}
