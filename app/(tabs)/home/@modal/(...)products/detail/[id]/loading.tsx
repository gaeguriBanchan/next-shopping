import BtnBack from '@/components/btn-back';
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function Loading() {
  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0 ">
      <BtnBack />
      <div className="max-w-screen-sm h-2/3 flex flex-col justify-center w-full bg-gray-800 rounded-md gap-5 ">
        <div className="bg-gray-700 text-gray-200 h-1/2 rounded-md flex justify-center items-center overflow-hidden">
          <PhotoIcon className="h-28  animate-pulse" />
        </div>
        <div className="h-1/2 flex gap-2 justify-start p-5 animate-pulse">
          <div className="size-14 rounded-full bg-gray-700" />
          <div className="flex flex-col gap-1">
            <div className="h-5 w-40 bg-gray-700 rounded-md" />
            <div className="h-5 w-20 bg-gray-700 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
