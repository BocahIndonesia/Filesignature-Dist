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
const NotFoundError_1 = __importDefault(require("../../utils/errors/NotFoundError"));
class default_1 {
    constructor() {
        this.client = clients_1.default.prisma.refreshToken;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.findByUserId(data.user_id);
                yield this.deleteByUserId(data.user_id);
            }
            catch (_a) {
                // user doesn't has a refresh token in the database
            }
            return yield this.client.create({ data });
        });
    }
    findByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.findFirstOrThrow({ where: { token } });
            }
            catch (_a) {
                throw new NotFoundError_1.default('Refresh token tidak ada di database');
            }
        });
    }
    deleteByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findByToken(token);
            yield this.client.deleteMany({ where: { token } });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.findUniqueOrThrow({ where: { user_id: userId } });
        });
    }
    deleteByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.deleteMany({ where: { user_id: userId } });
        });
    }
}
exports.default = default_1;
