'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

const checkUsername = (username: string) => {
  return !username.includes('potato');
};

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => {
  return password === confirmPassword;
};

// const usernameSchema = z.string().min(3).max(10);
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: '이름은 문자열이여야 합니다.',
        required_error: '이름을 입력 해주세요.',
      })
      .min(1, '1글자 이상 입력하세요.')
      .max(10, '10글자 이하로 입력하세요.')
      .toLowerCase()
      .trim()
      .transform((username) => `😀 ${username} 😀`)
      .refine(
        // false 면 출력됨.
        checkUsername,
        'potato 가 포함되는것은 안됩니다.'
      ),
    email: z.string().email('유효한 이메일 형식이 아닙니다.').toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, '비밀번호는 9글자 이상 작성하세요.')
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, '비밀번호는 9글자 이상 작성하세요.'),
  })
  // form 전체를 검사하면 formErrors 라고 생각하기 때문에 경로를 알려줘야한다.
  .refine(checkPasswords, {
    message: '두 비밀번호가 동일해야 합니다.',
    path: ['confirmPassword'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };
  // usernameSchema.parse(data.username);

  // try {
  //   formSchema.parse(data);
  // } catch (e) {
  //   console.log(e);
  // }

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
