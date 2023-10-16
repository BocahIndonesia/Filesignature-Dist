"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../utils/configs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthenticationError_1 = __importDefault(require("../utils/errors/AuthenticationError"));
function default_1(req, res, next) {
    var _a;
    const authHeader = req.headers.authorization;
    const token = (_a = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]) !== null && _a !== void 0 ? _a : null;
    if (token == null)
        next(new AuthenticationError_1.default('Anda tidak memiliki kredensial.', [{ header: 'Authorization', message: 'Kosong melompong, tolong isi header "Authorization" dengan token yang valid.' }]));
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, configs_1.default.jwt.access_secret);
            req.user = decoded.user;
            next();
        }
        catch (_b) {
            next(new AuthenticationError_1.default('Kredensial anda tidak valid.', [{ header: 'Authorization', message: 'Token palsu atau basi.' }]));
        }
    }
}
exports.default = default_1;
