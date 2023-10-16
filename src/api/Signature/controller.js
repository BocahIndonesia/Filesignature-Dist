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
const general_1 = require("../general");
const validator_1 = require("./utils/validator");
const NotFoundError_1 = __importDefault(require("../../utils/errors/NotFoundError"));
class default_1 {
    constructor() {
        this.service = clients_1.default.prisma.signature;
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [pagination, page] = (0, general_1.extractPagination)(req.query);
            const signatures = yield this.service.findMany({
                skip: page * pagination,
                take: pagination,
                orderBy: {
                    offset: req.query.sort_offset === undefined ? 'asc' : 'desc'
                }
            });
            res.json({
                status: 'success',
                data: signatures
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, validator_1.validateCommonDataSchema)(req.body);
            const signature = yield this.service.create({ data });
            res.status(201).json({
                status: 'success',
                data: signature
            });
        });
    }
    findWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id === undefined)
                throw new NotFoundError_1.default('Id dari Signature harus dicantumkan di URL.');
            const id = +req.params.id;
            try {
                const signature = yield this.service.findUniqueOrThrow({ where: { id } });
                res.json({
                    status: 'success',
                    data: signature
                });
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Signature dengan id: ${id} tidak ada di database`);
            }
        });
    }
    updateWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id === undefined)
                throw new NotFoundError_1.default('Id dari Signature harus dicantumkan di URL.');
            const id = +req.params.id;
            const data = (0, validator_1.validateDataUpdateSchema)(req.body);
            try {
                yield this.service.findUniqueOrThrow({ where: { id } });
                yield this.service.update({ where: { id }, data });
                res.status(204).send();
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Signature dengan id: ${id} tidak ada di database`);
            }
        });
    }
    deleteWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id === undefined)
                throw new NotFoundError_1.default('Id dari Signature harus dicantumkan di URL.');
            const id = +req.params.id;
            try {
                yield this.service.findUniqueOrThrow({ where: { id } });
                yield this.service.delete({ where: { id } });
                res.status(204).send();
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Signature dengan id: ${id} tidak ada di database`);
            }
        });
    }
}
exports.default = default_1;
