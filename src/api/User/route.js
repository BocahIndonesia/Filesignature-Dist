"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const asyncErrorCatcher_1 = __importDefault(require("../../utils/asyncErrorCatcher"));
const authenticationHandler_1 = __importDefault(require("../../middlewares/authenticationHandler"));
const router = express_1.default.Router();
const controller = new controller_1.default();
router.post('/users/register', (0, asyncErrorCatcher_1.default)(controller.register.bind(controller)));
router.post('/users/login', (0, asyncErrorCatcher_1.default)(controller.login.bind(controller)));
router.get('/users/:username', (0, asyncErrorCatcher_1.default)(controller.findByUsername.bind(controller)));
router.post('/users/refresh-token', (0, asyncErrorCatcher_1.default)(controller.refreshToken.bind(controller)));
router.post('/users/logout', [authenticationHandler_1.default], (0, asyncErrorCatcher_1.default)(controller.logout.bind(controller)));
router.patch('/users/:username', [authenticationHandler_1.default], (0, asyncErrorCatcher_1.default)(controller.updateByUsername.bind(controller)));
router.delete('/users/:username', [authenticationHandler_1.default], (0, asyncErrorCatcher_1.default)(controller.deleteByUsername.bind(controller)));
exports.default = router;
