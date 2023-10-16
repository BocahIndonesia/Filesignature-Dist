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
const AuthorizationError_1 = __importDefault(require("../../utils/errors/AuthorizationError"));
const NotFoundError_1 = __importDefault(require("../../utils/errors/NotFoundError"));
class default_1 {
    constructor() {
        this.service = clients_1.default.prisma.feedback;
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [pagination, page] = (0, general_1.extractPagination)(req.query);
            const orderParams = (0, general_1.extractOrderParams)(req.query);
            const orderBy = {};
            for (const q in orderParams) {
                if (q in ['o-createdAt', 'o-rate']) {
                    const value = +orderParams[q];
                    if ((value === 0) || (value === 1)) {
                        orderBy[q.slice(2, -1)] = value;
                    }
                }
            }
            const feedbacks = yield this.service.findMany({
                skip: page * pagination,
                take: pagination,
                orderBy
            });
            res.json({
                status: 'success',
                data: feedbacks
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, validator_1.validateCommonDataSchema)(req.body);
            const user = req.user;
            console.log(user);
            if (user === undefined)
                throw new AuthorizationError_1.default('Anda tidak berhak mengirimkan feedback.');
            const Feedback = yield this.service.create({ data: Object.assign(Object.assign({}, data), { user_id: user.id }) });
            res.status(201).json({
                status: 'success',
                data: Feedback
            });
        });
    }
    findWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id === undefined)
                throw new NotFoundError_1.default('Id dari Feedback harus dicantumkan di URL.');
            const id = +req.params.id;
            try {
                const Feedback = yield this.service.findUniqueOrThrow({ where: { id } });
                res.json({
                    status: 'success',
                    data: Feedback
                });
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Feedback dengan id: ${id} tidak ada di database`);
            }
        });
    }
    updateWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id === undefined)
                throw new NotFoundError_1.default('Id dari Feedback harus dicantumkan di URL.');
            const id = +req.params.id;
            const data = (0, validator_1.validateDataUpdateSchema)(req.body);
            try {
                yield this.service.findUniqueOrThrow({ where: { id } });
                yield this.service.update({ where: { id }, data });
                res.status(204).send();
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Feedback dengan id: ${id} tidak ada di database`);
            }
        });
    }
    deleteWhereId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id === undefined)
                throw new NotFoundError_1.default('Id dari Feedback harus dicantumkan di URL.');
            const id = +req.params.id;
            try {
                yield this.service.findUniqueOrThrow({ where: { id } });
                yield this.service.delete({ where: { id } });
                res.status(204).send();
            }
            catch (_a) {
                throw new NotFoundError_1.default(`Feedback dengan id: ${id} tidak ada di database`);
            }
        });
    }
}
exports.default = default_1;
