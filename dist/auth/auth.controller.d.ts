import { AuthService } from "./auth.service";
import { AuthDTO } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(authDTO: AuthDTO): Promise<{
        accessToken: string;
    }>;
    login(authDTO: AuthDTO): Promise<{
        accessToken: string;
    }>;
}
