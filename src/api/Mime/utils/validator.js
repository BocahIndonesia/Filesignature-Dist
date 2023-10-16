"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDataUpdateSchema = exports.DataUpdateSchema = exports.validateCommonDataSchema = exports.CommonDataSchema = void 0;
const zod_1 = require("zod");
const BadRequestError_1 = __importDefault(require("../../../utils/errors/BadRequestError"));
const zodIssuesMapper_1 = __importDefault(require("../../../utils/zodIssuesMapper"));
exports.CommonDataSchema = zod_1.z.object({
    name: zod_1.z.string().min(1)
});
function validateCommonDataSchema(data) {
    try {
        return exports.CommonDataSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk membuat Mime harus lengkap dan valid.', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateCommonDataSchema = validateCommonDataSchema;
exports.DataUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional()
});
function validateDataUpdateSchema(data) {
    try {
        return exports.DataUpdateSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk membuat Mime harus valid.', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateDataUpdateSchema = validateDataUpdateSchema;
