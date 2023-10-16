"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapper = void 0;
function mapper(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        country_code: user.country_code
    };
}
exports.mapper = mapper;
