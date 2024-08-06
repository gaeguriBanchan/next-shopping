import FormBtn from '@/components/form-btn';
import FormInput from '@/components/form-input';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-10 px-6">
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput type="text" placeholder="UserName" required errors={[]} />
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          required
          errors={[]}
        />
        <FormBtn loading={true} text="Create Account" />
      </form>
      <div className="w-full h-px bg-gray-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </span>
          <span>Sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}
