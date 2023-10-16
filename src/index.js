"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("./utils/configs"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const route_1 = __importDefault(require("./api/User/route"));
const route_2 = __importDefault(require("./api/Mime/route"));
const route_3 = __importDefault(require("./api/Extension/route"));
const route_4 = __importDefault(require("./api/Signature/route"));
const route_5 = __importDefault(require("./api/FileScanner/route"));
const route_6 = __importDefault(require("./api/Feedback/route"));
const route_7 = __importDefault(require("./api/basabasi/route"));
const route_8 = __importDefault(require("./api/country/route"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    console.log('Incoming request');
    next();
});
app.use(express_1.default.json());
app.get('/', (req, res) => res.send('Created by Mochy'));
//
app.use('/api', (0, cors_1.default)());
app.use('/api/v1', route_1.default);
app.use('/api/v1', route_2.default);
app.use('/api/v1', route_3.default);
app.use('/api/v1', route_4.default);
app.use('/api/v1', route_6.default);
app.use('/api/v1', route_7.default);
app.use('/api/v1', route_8.default);
app.use('/api/v1/services', route_5.default);
//
app.use(errorHandler_1.default);
app.listen(configs_1.default.server.port, () => { console.log(`Server berjalan pada port: ${configs_1.default.server.port}`); });
