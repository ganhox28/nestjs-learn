"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyJwtGuard = void 0;
const passport_1 = require("@nestjs/passport");
class MyJwtGuard extends (0, passport_1.AuthGuard)('jwt') {
}
exports.MyJwtGuard = MyJwtGuard;
//# sourceMappingURL=myjwt.guard.js.map