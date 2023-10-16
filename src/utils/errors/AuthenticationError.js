"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BadRequestError_1 = __importDefault(require("./BadRequestError"));
class default_1 extends BadRequestError_1.default {
    constructor(message = 'Gagal otentikasi.', details = null) {
        super(message);
        this.name = 'AuthenticationError';
        this.code = 401;
        this.details = details;
    }
}
exports.default = default_1;
