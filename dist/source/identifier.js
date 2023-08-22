"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suffixHTML = exports.suffixMarkdownV2 = exports.suffixMarkdown = exports.getAdditionalState = exports.isReplyToQuestion = exports.isContextReplyToMessage = void 0;
const telegram_format_1 = require("telegram-format");
const URL_TEXT = '\u200C';
const BASE_URL = 'http://t.me/#';
const URL_SEPERATOR = '#';
function isContextReplyToMessage(context) {
    return Boolean(context.message?.reply_to_message);
}
exports.isContextReplyToMessage = isContextReplyToMessage;
function getRelevantEntity(context) {
    const repliedTo = context.message.reply_to_message;
    const entities = repliedTo.entities
        ?? repliedTo.caption_entities
        ?? [];
    const relevantEntity = entities
        .slice(-1)
        .find((o) => o.type === 'text_link');
    return relevantEntity;
}
function isReplyToQuestion(context, identifier) {
    const relevantEntity = getRelevantEntity(context);
    const expectedUrl = url(identifier, undefined);
    return Boolean(relevantEntity?.url.startsWith(expectedUrl));
}
exports.isReplyToQuestion = isReplyToQuestion;
function getAdditionalState(context, identifier) {
    const relevantEntity = getRelevantEntity(context);
    const expectedUrl = url(identifier, undefined);
    const part = relevantEntity.url.slice(expectedUrl.length);
    return decodeURI(part);
}
exports.getAdditionalState = getAdditionalState;
function url(identifier, additionalState) {
    return encodeURI(BASE_URL + identifier + URL_SEPERATOR + (additionalState ?? ''));
}
function suffixMarkdown(identifier, additionalState) {
    return telegram_format_1.markdown.url(URL_TEXT, url(identifier, additionalState));
}
exports.suffixMarkdown = suffixMarkdown;
function suffixMarkdownV2(identifier, additionalState) {
    return telegram_format_1.markdownv2.url(URL_TEXT, url(identifier, additionalState));
}
exports.suffixMarkdownV2 = suffixMarkdownV2;
function suffixHTML(identifier, additionalState) {
    return telegram_format_1.html.url(URL_TEXT, url(identifier, additionalState));
}
exports.suffixHTML = suffixHTML;
