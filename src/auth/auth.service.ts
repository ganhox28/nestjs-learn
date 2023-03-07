import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, Note } from "@prisma/client";
import { AuthDTO } from './dto'
import * as argon from 'argon2'
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Injectable({})

export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {

    }
    async register(authDTO: AuthDTO) {
        const hashedPassword = await argon.hash(authDTO.password)
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: authDTO.email,
                    hashedPassword: hashedPassword,
                    firstName: '',
                    lastName: ''
                },
                select: {
                    id: true,
                    email: true,
                    createAt: true
                }
            })
            return await this.signJwtToken(user.id, user.email)
        } catch (err) {
            if(err.code == 'P2002') {
                throw new ForbiddenException(`Email đã tồn tại`)
            }
        }
    }

    async login(authDTO: AuthDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDTO.email
            }
        })

        if(!user) {
            throw new ForbiddenException(
                'Không tìm thấy email'
            )
        }

        const passwordMatched = await argon.verify(
            user.hashedPassword,
            authDTO.password
        )

        if(!passwordMatched) {
            throw new ForbiddenException(
                'Sai mật khẩu'
            )
        }

        delete user.hashedPassword;
        
        return await this.signJwtToken(user.id, user.email)
    }

    async signJwtToken (userId: number, email: string):Promise<{accessToken: string}>{
        const payload = {
            sub: userId,
            email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString,
        }
    }
}