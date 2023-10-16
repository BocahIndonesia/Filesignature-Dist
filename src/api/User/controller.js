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
const configs_1 = __importDefault(require("../../utils/configs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = require("./utils/validator");
const AuthenticationError_1 = __importDefault(require("../../utils/errors/AuthenticationError"));
const mapper_1 = require("./utils/mapper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const service_1 = __importDefault(require("./utils/service"));
const service_2 = __importDefault(require("../RefreshToken/service"));
const BadRequestError_1 = __importDefault(require("../../utils/errors/BadRequestError"));
const AuthorizationError_1 = __importDefault(require("../../utils/errors/AuthorizationError"));
const NotFoundError_1 = __importDefault(require("../../utils/errors/NotFoundError"));
class default_1 {
    constructor() {
        this.service = new service_1.default();
        this.refreshTokenService = new service_2.default();
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (0, validator_1.validateDataRegister)(req.body);
            data.password = yield bcrypt_1.default.hash(data.password, configs_1.default.bcrypt.salt);
            const user = yield this.service.create(data);
            res.status(201).json({
                status: 'success',
                data: (0, mapper_1.mapper)(user)
            });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = (0, validator_1.validateDataLogin)(req.body);
            try {
                const user = yield this.service.findByUsername(username);
                yield bcrypt_1.default.compare(password, user.password);
                const accessToken = jsonwebtoken_1.default.sign({ user: (0, mapper_1.mapper)(user) }, configs_1.default.jwt.access_secret, { expiresIn: configs_1.default.jwt.access_token_age });
                const refreshToken = jsonwebtoken_1.default.sign({ user: (0, mapper_1.mapper)(user) }, configs_1.default.jwt.refresh_secret, { expiresIn: configs_1.default.jwt.refresh_token_age });
                yield this.refreshTokenService.create({ user_id: user.id, token: refreshToken });
                res.json({
                    status: 'success',
                    data: { accessToken, refreshToken }
                });
            }
            catch (_a) {
                throw new AuthenticationError_1.default('Gagal login, username/password salah :(');
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = (0, validator_1.validateDataRefreshToken)(req.body);
            try {
                yield this.refreshTokenService.findByToken(refreshToken);
                try {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, configs_1.default.jwt.refresh_secret);
                    const user = decoded.user;
                    const accessToken = jsonwebtoken_1.default.sign({ user: (0, mapper_1.mapper)(user) }, configs_1.default.jwt.access_secret, { expiresIn: configs_1.default.jwt.access_token_age });
                    res.json({
                        status: 'success',
                        data: { accessToken }
                    });
                }
                catch (_a) {
                    yield this.refreshTokenService.deleteByToken(refreshToken);
                    throw new AuthorizationError_1.default('Gagal refresh, refresh token tidak valid atau basi');
                }
            }
            catch (_b) {
                throw new AuthorizationError_1.default('Gagal refresh, refresh token tidak ada di database.');
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (user === undefined)
                throw new AuthorizationError_1.default('Anda tidak berhak melakukan logout.');
            yield this.refreshTokenService.deleteByUserId(user.id);
            res.status(204).send();
        });
    }
    findByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            if (username === undefined)
                throw new NotFoundError_1.default('Tolong cantumkan username pada path URL');
            const user = yield this.service.findByUsername(username);
            res.json({
                status: 'success',
                data: (0, mapper_1.mapper)(user)
            });
        });
    }
    updateByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const user = req.user;
            if (username === undefined)
                throw new NotFoundError_1.default('Tolong cantumkan username pada path URL.');
            if (user === undefined)
                throw new AuthorizationError_1.default('Anda tidak berhak melakukan update informasi.');
            const data = (0, validator_1.validateDataUpdate)(req.body);
            try {
                yield this.service.updateByUsername(username, data);
                res.status(204).send();
            }
            catch (e) {
                throw new BadRequestError_1.default('Gagal memperbarui profile user');
            }
        });
    }
    deleteByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const user = req.user;
            if (username === undefined)
                throw new NotFoundError_1.default('Tolong cantumkan username pada path URL.');
            if (user === undefined)
                throw new AuthorizationError_1.default('Anda tidak berhak menghapus informasi.');
            yield this.service.deleteByUsername(username);
            res.status(204).send();
        });
    }
}
exports.default = default_1;
