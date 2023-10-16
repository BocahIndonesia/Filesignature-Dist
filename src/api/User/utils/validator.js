"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDataRefreshToken = exports.DataRefreshTokenSchema = exports.validateDataUpdate = exports.DataUpdateSchema = exports.validateDataLogin = exports.DataLoginSchema = exports.validateDataRegister = exports.DataRegisterSchema = void 0;
const zod_1 = require("zod");
const BadRequestError_1 = __importDefault(require("../../../utils/errors/BadRequestError"));
const zodIssuesMapper_1 = __importDefault(require("../../../utils/zodIssuesMapper"));
// Validation for user registration:
exports.DataRegisterSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: 'Email harus dicantumkan' }).email().min(12),
    name: zod_1.z.string().min(7),
    username: zod_1.z.string().min(7),
    password: zod_1.z.string().min(7),
    country_code: zod_1.z.string().min(1)
});
function validateDataRegister(data) {
    try {
        return exports.DataRegisterSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk register harus valid dan lengkap', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateDataRegister = validateDataRegister;
// Validation for user login:
exports.DataLoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(7),
    password: zod_1.z.string().min(7)
});
function validateDataLogin(data) {
    try {
        return exports.DataLoginSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk login valid dan lengkap', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateDataLogin = validateDataLogin;
exports.DataUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(7).optional(),
    password: zod_1.z.string().min(7).optional(),
    country_code: zod_1.z.string().min(1).optional()
});
function validateDataUpdate(data) {
    try {
        return exports.DataUpdateSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk update harus tepat', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateDataUpdate = validateDataUpdate;
exports.DataRefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string()
});
function validateDataRefreshToken(data) {
    try {
        return exports.DataRefreshTokenSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk refresh token tidak lengkap', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateDataRefreshToken = validateDataRefreshToken;
