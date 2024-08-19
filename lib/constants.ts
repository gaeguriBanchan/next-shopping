export const PASSWORD_MIN_LENGTH = 9;
export const PASSWORD_REGEX = new RegExp(
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
  /^(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  '비밀번호는 영문 소문자, 숫자, 특수문자를 포함해야 합니다.';
