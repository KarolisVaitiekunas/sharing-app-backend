import { Prisma } from '@prisma/client';
import prisma from '../utils/initializePrismaClient';

export function createUser(input: Prisma.UserCreateInput) {
  return prisma.user.create({
    data: {
      email: input.email,
      password: input.password,
    },
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}
