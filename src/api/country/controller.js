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
const BadRequestError_1 = __importDefault(require("../../utils/errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../../utils/errors/NotFoundError"));
class default_1 {
    constructor() {
        this.service = clients_1.default.prisma.country;
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [pagination, page] = (0, general_1.extractPagination)(req.query);
            const countries = yield this.service.findMany({
                skip: page * pagination,
                take: pagination,
                orderBy: {
                    name: req.query.sort_name === undefined ? 'asc' : 'desc'
                }
            });
            res.json({
                status: 'success',
                data: countries
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, validator_1.validateCommonDataSchema)(req.body);
            const nameExist = yield this.service.findUnique({ where: { name: data.name } });
            if (nameExist !== null)
                throw new BadRequestError_1.default(`Country name: ${data.name} telah ada di database.`);
            const codeExist = yield this.service.findUnique({ where: { code: data.code } });
            if (codeExist !== null)
                throw new BadRequestError_1.default(`Country code: ${data.code} telah ada di database.`);
            const countries = yield this.service.create({ data });
            res.status(201).json({
                status: 'success',
                data: countries
            });
        });
    }
    findWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.code === undefined)
                throw new NotFoundError_1.default('Code dari Country harus dicantumkan di URL.');
            const code = req.params.code;
            try {
                const countries = yield this.service.findUniqueOrThrow({ where: { code } });
                res.json({
                    status: 'success',
                    data: countries
                });
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Country dengan code: ${code} tidak ada di database`);
            }
        });
    }
    updateWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.code === undefined)
                throw new NotFoundError_1.default('Id dari Country harus dicantumkan di URL.');
            const code = req.params.code;
            const data = (0, validator_1.validateDataUpdateSchema)(req.body);
            try {
                yield this.service.findUniqueOrThrow({ where: { code } });
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Country dengan code: ${code} tidak ada di database`);
            }
            if (data.code !== undefined) {
                const codeExist = yield this.service.findUnique({ where: { code: data.code } });
                if (codeExist !== null)
                    throw new BadRequestError_1.default(`Country code: ${data.code} telah ada di database.`);
            }
            if (data.name !== undefined) {
                const nameExist = yield this.service.findUnique({ where: { name: data.name } });
                if (nameExist !== null)
                    throw new BadRequestError_1.default(`Country name: ${data.name} telah ada di database.`);
            }
            yield this.service.update({ where: { code }, data });
            res.status(204).send();
        });
    }
    deleteWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.code === undefined)
                throw new NotFoundError_1.default('Id dari Country harus dicantumkan di URL.');
            const code = req.params.code;
            try {
                yield this.service.findUniqueOrThrow({ where: { code } });
                yield this.service.delete({ where: { code } });
                res.status(204).send();
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Country dengan code: ${code} tidak ada di database`);
            }
        });
    }
}
exports.default = default_1;
