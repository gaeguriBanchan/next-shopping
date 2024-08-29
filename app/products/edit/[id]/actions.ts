'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import { title } from 'process';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCachedProduct } from '@/app/products/detail/[id]/page';

const productSchema = z.object({
  id: z.string(),
  photo: z.string().optional(),
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, '1글자 이상 입력하세요.'),
  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, '1글자 이상 입력하세요.'),
  price: z.coerce.number({
    required_error: 'Price is required',
  }),
});

export async function editProduct(_: any, formData: FormData) {
  const data = {
    id: formData.get('id'),
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  let newPhotoPath = null;

  // if (data.photo instanceof File) {
  //   const photoData = await data.photo.arrayBuffer();
  //   await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
  //   data.photo = `/${data.photo.name}`;
  // }
  if (data.photo instanceof File && data.photo.size > 0) {
    // 파일이 존재하고 크기가 0보다 큰지 확인
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    newPhotoPath = `/${data.photo.name}`;
  }
  // const result = productSchema.safeParse(data);
  const result = productSchema.safeParse({
    ...data,
    photo: newPhotoPath || undefined, // photo가 없으면 undefined로 처리
  });
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const id = Number(result.data.id);
      const prevProduct = await getCachedProduct(id);
      if (!result.data.photo) {
        result.data.photo = prevProduct?.photo;
      }
      const product = await db.product.update({
        where: { id: id },
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });
      revalidatePath('/home');
      revalidateTag('product-detail');
      redirect(`/products/detail/${product.id}`);
      // redirect('/home');
    }
  }
}
