"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clients_1 = __importDefault(require("../../utils/clients"));
const functions_1 = require("./utils/functions");
class default_1 {
    constructor() {
        this.mimeService = clients_1.default.prisma.mime;
        this.extensionService = clients_1.default.prisma.extension;
        this.signatureService = clients_1.default.prisma.signature;
    }
    scanFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = Array.isArray(req.files) ? req.files : [];
            res.send({
                status: 'success',
                data: yield (0, functions_1.scanFiles)(files)
            });
        });
    }
}
exports.default = default_1;
