"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const dist_1 = require("@nestjs/jwt/dist");
const config_service_1 = require("@nestjs/config/dist/config.service");
let AuthService = class AuthService {
    constructor(prismaService, jwtService, configService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(authDTO) {
        const hashedPassword = await argon.hash(authDTO.password);
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
            });
            return await this.signJwtToken(user.id, user.email);
        }
        catch (err) {
            if (err.code == 'P2002') {
                throw new common_1.ForbiddenException(`Email đã tồn tại`);
            }
        }
    }
    async login(authDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDTO.email
            }
        });
        if (!user) {
            throw new common_1.ForbiddenException('Không tìm thấy email');
        }
        const passwordMatched = await argon.verify(user.hashedPassword, authDTO.password);
        if (!passwordMatched) {
            throw new common_1.ForbiddenException('Sai mật khẩu');
        }
        delete user.hashedPassword;
        return await this.signJwtToken(user.id, user.email);
    }
    async signJwtToken(userId, email) {
        const payload = {
            sub: userId,
            email
        };
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret: this.configService.get('JWT_SECRET')
        });
        return {
            accessToken: jwtString,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)({}),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dist_1.JwtService,
        config_service_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map