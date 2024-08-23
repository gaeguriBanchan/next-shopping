'use client';

import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/products/action';

interface IProductListProps {
  //   initialProducts: {
  //     id: number;
  //     title: string;
  //     created_at: Date;
  //     price: number;
  //     photo: string;
  // }[]
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: IProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page + 1);
    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setIsLastPage(true);
    }
    setIsLoading(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (
        <h2>마지막 상품입니다.</h2>
      ) : (
        <button
          onClick={onLoadMoreClick}
          disabled={isLoading}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? '로딩 중' : 'Load more'}
        </button>
      )}
    </div>
  );
}
