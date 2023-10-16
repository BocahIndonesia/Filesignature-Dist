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
    offset: zod_1.z.number().gte(0),
    hex: zod_1.z.string(),
    extension_id: zod_1.z.number().gt(0)
});
function validateCommonDataSchema(data) {
    try {
        return exports.CommonDataSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk membuat Signature harus lengkap dan valid.', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateCommonDataSchema = validateCommonDataSchema;
exports.DataUpdateSchema = zod_1.z.object({
    offset: zod_1.z.number().gte(0).optional(),
    hex: zod_1.z.string().optional(),
    extension_id: zod_1.z.number().gt(0).optional()
});
function validateDataUpdateSchema(data) {
    try {
        return exports.DataUpdateSchema.parse(data);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError)
            throw new BadRequestError_1.default('Informasi yang dicantumkan untuk membuat Signature harus valid.', (0, zodIssuesMapper_1.default)(e.issues));
        throw (e);
    }
}
exports.validateDataUpdateSchema = validateDataUpdateSchema;
