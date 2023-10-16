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
// import type { User } from '@prisma/client'
// import bcrypt from 'bcrypt'
// import type { z } from 'zod'
// import { validateDataRegister, validateDataLogin, validateDataUpdate, validateDataRefreshToken } from './utils/validator'
// import type { DataRegisterSchema, DataLoginSchema, DataUpdateSchema, DataRefreshTokenSchema } from './utils/validator'
// import AuthenticationError from '../../utils/errors/AuthenticationError'
// import { mapper } from './utils/mapper'
// import jwt from 'jsonwebtoken'
// import Service from './utils/service'
// import RefreshTokenService from '../RefreshToken/service'
// import BadRequestError from '../../utils/errors/BadRequestError'
// import type * as core from 'express-serve-static-core'
// import AuthorizationError from '../../utils/errors/AuthorizationError'
// import type { JwtPayload } from 'jsonwebtoken'
// import NotFoundError from '../../utils/errors/NotFoundError'
const clients_1 = __importDefault(require("../../utils/clients"));
class default_1 {
    constructor() {
        this.user = clients_1.default.prisma.user;
    }
    ringkasProgress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalUser = yield this.user.count();
            const totalCountry = (yield this.user.findMany({ distinct: ['country_code'] })).length;
            res.status(200).json({
                totalUser,
                totalCountry
            });
        });
    }
}
exports.default = default_1;
