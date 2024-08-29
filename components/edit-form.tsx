'use client';

import { ProductType } from '@/app/products/detail/[id]/page';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import Input from './input';
import Btn from './btn';
import { notFound, redirect } from 'next/navigation';
import { editProduct } from '@/app/products/edit/[id]/actions';
import db from '@/lib/db';

export default function EditForm({
  id,
  product,
  isOwner,
}: {
  id: number;
  product: ProductType;
  isOwner: boolean;
}) {
  const [preview, setPreview] = useState(`${product?.photo}`);
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    // if (!file.type.startsWith('image/')) {
    //   return {
    //     error: '이미지 파일만 업로드 가능합니다. ',
    //   };
    // }

    // const fileSizeInMd = file.size / (1024 * 1024);

    // if (fileSizeInMd > 2) {
    //   return {
    //     error:
    //       '이미지의 크기가 2MD를 초과하는 이미지는 업로드 할 수 없습니다. ',
    //   };
    // }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const [state, dispatch] = useFormState(editProduct, null);
  if (!isOwner) {
    return notFound();
  }

  return (
    <form action={dispatch} className="p-5 flex flex-col gap-5">
      <label
        htmlFor="photo"
        className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
        style={{
          backgroundImage: `url(${preview})`,
        }}
      >
        {/* {preview === '' ? (
          <>
            <PhotoIcon className="w-20" />
            <div className="text-neutral-400 text-sm">
              사진을 추가해주세요.
              {state?.fieldErrors.photo}
            </div>
          </>
        ) : null} */}
      </label>
      <input
        onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        accept="image/*"
        className="hidden"
      />
      <Input
        name="id"
        required
        placeholder="id"
        defaultValue={product?.id}
        type="number"
        errors={state?.fieldErrors.id}
        className="hidden"
      />
      <Input
        name="title"
        required
        placeholder="제목"
        defaultValue={product?.title}
        type="text"
        errors={state?.fieldErrors.title}
      />
      <Input
        name="price"
        type="number"
        required
        placeholder="가격"
        defaultValue={product?.price}
        errors={state?.fieldErrors.price}
      />
      <Input
        name="description"
        type="text"
        required
        placeholder="자세한 설명"
        defaultValue={product?.description}
        errors={state?.fieldErrors.description}
      />
      <Btn text="수정 완료" />
    </form>
  );
}
