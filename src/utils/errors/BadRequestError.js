"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 extends Error {
    constructor(message = 'Ada Error.', details = null) {
        super(message);
        this.name = 'BadRequestError';
        this.code = 400;
        this.details = details;
    }
    toObject() {
        return {
            message: this.message,
            details: this.details
        };
    }
}
exports.default = default_1;
