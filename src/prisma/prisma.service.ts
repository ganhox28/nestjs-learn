import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    // url: "postgresql://postgres:Abc123@localhost:5434/testdb?schema=public"
                    url: configService.get('DATABASE_URL')
                }
            }
        })
        console.log(`url ${configService.get('DATABASE_URL')}`)
    }

    cleanDatabase() {
        console.log('cleanDatabase')
        return this.$transaction([
            this.note.deleteMany(),
            this.user.deleteMany()
        ])
    }
}