'use server';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, '이 이메일 계정이 존재하지 않습니다.'),
  password: z.string({
    required_error: '비밀번호를 입력하세요.',
  }),
  // .min(PASSWORD_MIN_LENGTH)
  // .regex(PASSWORD_REGEX, '비밀번호 양식을 다시 확인하세요.'),
});

export async function login(prevState: any, formData: FormData) {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    // compare : 사용자가 입력한 값을 해쉬값과 비교
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? 'xxxx'
    );
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      redirect('/profile');
    } else {
      return {
        fieldErrors: {
          password: ['비밀번호를 다시 확인하세요.'],
          email: [],
        },
      };
    }

    // log the user in
    // redirect "/profile "
  }
}
