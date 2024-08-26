import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return notFound();
  }
  const accessTokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    code,
  }).toString();
  const accessTokenURL = `https://kauth.kakao.com/oauth/token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
  const { token_type, access_token } = await accessTokenResponse.json();
  // const kakao = await accessTokenResponse.json();
  // console.log(kakao);
  const accessUserInfoURL = 'https://kapi.kakao.com/v2/user/me';
  const accessUserInfoResponse = await fetch(accessUserInfoURL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    cache: 'no-cache',
  });
  const kakaoUser = await accessUserInfoResponse.json();
  // console.log(kakaoUser.id);
  const user = await db.user.findUnique({
    where: {
      kakao_id: kakaoUser.id + '',
    },
    select: {
      id: true,
    },
  });
  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect('/profile');
  }
  const newUser = await db.user.create({
    data: {
      username: `${kakaoUser.properties.nickname}-kakao`,
      kakao_id: kakaoUser.id + '',
      avatar: kakaoUser.properties.profile_image,
    },
    select: {
      id: true,
    },
  });
  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect('/profile');
}
