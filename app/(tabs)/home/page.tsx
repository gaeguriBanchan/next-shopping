import ListProduct from '@/components/list-product';
import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';

const getCachedProducts = unstable_cache(
  getInitialProducts,
  ['home-products'],
  // revalidate: 다시 요청이 왔을때 이전 요청이 60초가 넘었다면 다시 호출.
  {
    revalidate: 60,
  }
);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: 'Home',
};

export default async function Products() {
  const initialProducts = await getCachedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <div className="flex max-w-screen-sm justify-end p-5">
        <Link
          href="/products/add"
          className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 text-white transition-colors hover:bg-orange-400"
        >
          <PlusIcon className="size-10" />
        </Link>
      </div>
    </div>
  );
}
