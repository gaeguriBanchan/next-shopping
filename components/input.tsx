import { InputHTMLAttributes } from 'react';

interface IInputProps {
  name: string;
  errors?: string[];
}

export default function Input({
  name,
  errors = [],
  ...rest
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition focus:ring-orange-500 border-none ring-gray-600 placeholder:text-gray-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
}
