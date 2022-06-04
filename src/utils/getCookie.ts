import { Request } from 'express';

export default function getCookie(name: string, req: Request) {
  const match = req.headers.cookie?.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}
