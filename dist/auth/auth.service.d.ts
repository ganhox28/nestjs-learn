import { PrismaService } from "../prisma/prisma.service";
import { AuthDTO } from './dto';
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config/dist/config.service";
export declare class AuthService {
    private prismaService;
    private jwtService;
    private configService;
    constructor(prismaService: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(authDTO: AuthDTO): Promise<{
        accessToken: string;
    }>;
    login(authDTO: AuthDTO): Promise<{
        accessToken: string;
    }>;
    signJwtToken(userId: number, email: string): Promise<{
        accessToken: string;
    }>;
}
