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
const clients_1 = __importDefault(require("../../../utils/clients"));
const BadRequestError_1 = __importDefault(require("../../../utils/errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../../../utils/errors/NotFoundError"));
class default_1 {
    constructor() {
        this.client = clients_1.default.prisma.user;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email } = data;
            try {
                yield this.findByUsername(username);
                throw new BadRequestError_1.default(`Username: ${username} telah dipakai oleh orang lain, coba username lain.`);
            }
            catch (_a) {
                try {
                    yield this.findByEmail(email);
                    throw new BadRequestError_1.default(`Email: ${email} telah dipakai oleh orang lain, coba email lain.`);
                }
                catch (_b) {
                    return yield this.client.create({ data });
                }
            }
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.findFirstOrThrow({ where: { username } });
            }
            catch (_a) {
                throw new NotFoundError_1.default(`User dengan username: ${username} tidak ada.`);
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.findFirstOrThrow({ where: { email } });
            }
            catch (_a) {
                throw new NotFoundError_1.default(`User dengan email: ${email} tidak ada.`);
            }
        });
    }
    updateByUsername(username, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findByUsername(username);
            return yield this.client.update({ where: { username }, data });
        });
    }
    deleteByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findByUsername(username);
            yield this.client.delete({ where: { username } });
        });
    }
}
exports.default = default_1;
