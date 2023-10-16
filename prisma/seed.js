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
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function seedImportant() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(fs_1.default.readFileSync('./prisma/magic.json', 'utf-8'));
        for (const [key, value] of Object.entries(data)) {
            yield prisma.mime.upsert({
                where: {
                    name: value.mime
                },
                update: {
                    extensions: {
                        create: {
                            name: key,
                            signatures: {
                                create: value.signs
                            }
                        }
                    }
                },
                create: {
                    name: value.mime,
                    extensions: {
                        create: {
                            name: key,
                            signatures: {
                                create: value.signs
                            }
                        }
                    }
                }
            });
        }
    });
}
function seedCountry() {
    return __awaiter(this, void 0, void 0, function* () {
        const countries = JSON.parse(fs_1.default.readFileSync('./prisma/countries.json', 'utf-8'));
        for (const country of countries) {
            yield prisma.country.create({
                data: {
                    code: country.code,
                    name: country.name
                }
            });
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield seedImportant();
        yield seedCountry();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
