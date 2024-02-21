import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined;
}

// Todo: Kada zavrsis sa programiranjem, obrisi globalThis.prisma iz ove jednakosti. On te je stitio od preopterecenja pri hot reaload, nece raditi ispravno za korisnike sa time.
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db