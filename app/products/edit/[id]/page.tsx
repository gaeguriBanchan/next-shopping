import EditForm from '@/components/edit-form';
import { getCachedProduct, getIsOwner } from '@/app/products/detail/[id]/page';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function ProductEdit({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const deleteProduct = async () => {
    'use server';
    await db.product.delete({
      where: {
        id,
      },
      select: null,
    });
    revalidatePath('/home');
    redirect('/home');
  };

  return (
    <div className="max-w-screen-sm">
      <EditForm id={id} isOwner={isOwner} product={product} />
      <form action={deleteProduct} className="px-5">
        <button className="w-full bg-red-500 text-white  font-medium  rounded-md text-center hover:bg-red-400 transition-colors h-10 disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-not-allowed">
          상품 삭제
        </button>
      </form>
    </div>
  );
}
