import ListProduct from '@/components/list-product';
import ProductList from '@/components/product-list';
import db from '@/lib/db';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Prisma } from '@prisma/client';
import { revalidatePath, unstable_cache } from 'next/cache';
import Link from 'next/link';

const getCachedProducts = unstable_cache(getInitialProducts, ['home-products']);

async function getInitialProducts() {
  console.log('hit!!');
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

// dynamic 은 원래는 'auto'. 'force-dynamic'로 바꾸면 static 페이지가 dynamic으로 바뀜.=> 매번 방문할때 마다 다 새로 만들어진다.
// export const dynamic = 'force-dynamic';

// revalidate : 특정 시간이 지나면 revalidate. production mode에서 빌드했을때만 작동함. (빌드하고 npm run start)
// static 페이지로 남아있을수있음. 새로고침할때마다 모든걸 다시 부르지 않아서 좋다.
export const revalidate = 1800;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  // const revalidate = async () => {
  //   'use server';
  //   // revalidatePath : 경로과 관련된 모든 cache를 revalidate.
  //   revalidatePath('/home');
  // };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      {/* <form action={revalidate}>
        <button>revalidate</button>
      </form> */}
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
