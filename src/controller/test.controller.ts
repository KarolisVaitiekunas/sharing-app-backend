import axios from 'axios';
import { Request, Response } from 'express';

export async function testHandler1(req: Request, res: Response) {
  throw new Error('this is a very serious error');
}

export async function testHandler2(req: Request, res: Response) {
  const result = await axios.get('httpz://example.com');
  res.end(result.data);
}
