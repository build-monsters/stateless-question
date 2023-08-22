"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatelessQuestion = exports.questions = void 0;
const identifier_js_1 = require("./identifier.js");
exports.questions = [];
class StatelessQuestion {
    constructor(uniqueIdentifier, answer) {
        Object.defineProperty(this, "uniqueIdentifier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: uniqueIdentifier
        });
        Object.defineProperty(this, "answer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: answer
        });
    }
    middleware() {
        return async (context, next) => {
            if (
            // @ts-ignore
            (context.message && context.message.text && this.inQuestions(context.from.id, this.uniqueIdentifier)) ||
                ((0, identifier_js_1.isContextReplyToMessage)(context) && (0, identifier_js_1.isReplyToQuestion)(context, this.uniqueIdentifier))) {
                // @ts-ignore
                return this.answer(context, context.user.scene.split('/')[0] + '/');
            }
            await next();
        };
    }
    messageSuffixHTML(additionalState) {
        return (0, identifier_js_1.suffixHTML)(this.uniqueIdentifier, additionalState);
    }
    messageSuffixMarkdown(additionalState) {
        return (0, identifier_js_1.suffixMarkdown)(this.uniqueIdentifier, additionalState);
    }
    messageSuffixMarkdownV2(additionalState) {
        return (0, identifier_js_1.suffixMarkdownV2)(this.uniqueIdentifier, additionalState);
    }
    async replyWithHTML(context, text, additionalState) {
        exports.questions.push([context.from?.id, this.uniqueIdentifier]);
        const textResult = text + this.messageSuffixHTML(additionalState);
        return context.reply(textResult, {
            reply_markup: { force_reply: true },
            parse_mode: 'HTML',
        });
    }
    async replyWithMarkdown(context, text, additionalState) {
        exports.questions.push([context.from?.id, this.uniqueIdentifier]);
        const textResult = text + this.messageSuffixMarkdown(additionalState);
        return context.reply(textResult, {
            reply_markup: { force_reply: true },
            parse_mode: 'Markdown',
        });
    }
    async replyWithMarkdownV2(context, text, additionalState) {
        exports.questions.push([context.from?.id, this.uniqueIdentifier]);
        const textResult = text + this.messageSuffixMarkdownV2(additionalState);
        return context.reply(textResult, {
            reply_markup: { force_reply: true },
            parse_mode: 'MarkdownV2',
        });
    }
    inQuestions(id, need) {
        for (const question of exports.questions) {
            if (question[0] == id && question[1] == need) {
                exports.questions = this.removeItemOnce(exports.questions, question);
                return true;
            }
        }
        return false;
    }
    removeItemOnce(arr, value) {
        const index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }
}
exports.StatelessQuestion = StatelessQuestion;
