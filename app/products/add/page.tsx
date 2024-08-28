'use client';

import Btn from '@/components/btn';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { uploadProduct } from './actions';
import { error } from 'console';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
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
  const [state, dispatch] = useFormState(uploadProduct, null);
  return (
    <div>
      <form action={dispatch} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
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
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <Btn text="작성 완료" />
      </form>
    </div>
  );
}
