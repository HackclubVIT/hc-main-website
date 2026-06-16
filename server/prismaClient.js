import { PrismaClient } from '@prisma/client';

// BigInt isn't JSON-serializable by default. Our row ids are < 2^53, so it is
// safe to emit them as plain numbers when Express calls JSON.stringify.
if (typeof BigInt.prototype.toJSON !== 'function') {
  BigInt.prototype.toJSON = function toJSON() {
    return Number(this);
  };
}

const prisma = new PrismaClient();

export default prisma;
