'use server';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: '비밀번호를 입력하세요.',
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, '비밀번호 양식을 다시 확인하세요.'),
});

export async function login(prevState: any, formData: FormData) {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
