"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const asyncErrorCatcher_1 = __importDefault(require("../../utils/asyncErrorCatcher"));
const router = express_1.default.Router();
const controller = new controller_1.default();
router.get('/basabasi/ringkasan-progress', (0, asyncErrorCatcher_1.default)(controller.ringkasProgress.bind(controller)));
exports.default = router;
