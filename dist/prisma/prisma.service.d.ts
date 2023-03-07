import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient {
    constructor(configService: ConfigService);
    cleanDatabase(): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload]>;
}
