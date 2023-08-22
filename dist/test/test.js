"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const grammy_1 = require("grammy");
const identifier_js_1 = require("../source/identifier.js");
const index_js_1 = require("../source/index.js");
(0, ava_1.default)('uniqueIdentifier keeps the same', t => {
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.pass();
    });
    t.is(question.uniqueIdentifier, 'unicorns');
});
(0, ava_1.default)('messageSuffixMarkdown', t => {
    t.is((0, identifier_js_1.suffixMarkdown)('unicorns', undefined), '[\u200C](http://t.me/#unicorns#)');
});
(0, ava_1.default)('messageSuffixMarkdown with additional state', t => {
    t.is((0, identifier_js_1.suffixMarkdown)('unicorns', 'explode'), '[\u200C](http://t.me/#unicorns#explode)');
});
(0, ava_1.default)('messageSuffixMarkdown additional state gets url encoded correctly', t => {
    t.is((0, identifier_js_1.suffixMarkdown)('unicorns', 'foo bar'), '[\u200C](http://t.me/#unicorns#foo%20bar)');
});
(0, ava_1.default)('messageSuffixMarkdownV2', t => {
    t.is((0, identifier_js_1.suffixMarkdownV2)('unicorns', undefined), '[\u200C](http://t.me/#unicorns#)');
});
(0, ava_1.default)('messageSuffixMarkdownV2 with additional state', t => {
    t.is((0, identifier_js_1.suffixMarkdownV2)('unicorns', 'explode'), '[\u200C](http://t.me/#unicorns#explode)');
});
(0, ava_1.default)('messageSuffixMarkdownV2 additional state gets url encoded correctly', t => {
    t.is((0, identifier_js_1.suffixMarkdownV2)('unicorns', 'foo bar'), '[\u200C](http://t.me/#unicorns#foo%20bar)');
});
(0, ava_1.default)('messageSuffixHTML', t => {
    t.is((0, identifier_js_1.suffixHTML)('unicorns', undefined), '<a href="http://t.me/#unicorns#">\u200C</a>');
});
(0, ava_1.default)('messageSuffixHTML with additional state', t => {
    t.is((0, identifier_js_1.suffixHTML)('unicorns', 'explode'), '<a href="http://t.me/#unicorns#explode">\u200C</a>');
});
(0, ava_1.default)('messageSuffixHTML additional state gets url encoded correctly', t => {
    t.is((0, identifier_js_1.suffixHTML)('unicorns', 'foo bar'), '<a href="http://t.me/#unicorns#foo%20bar">\u200C</a>');
});
(0, ava_1.default)('can replyWithMarkdown the question correctly', async (t) => {
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = async (text, extra) => {
            t.is(text, 'banana' + question.messageSuffixMarkdown());
            t.deepEqual(extra, {
                parse_mode: 'Markdown',
                reply_markup: { force_reply: true },
            });
            return {
                message_id: 42,
                date: 42,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                text: '666',
            };
        };
        return next();
    });
    bot.use(async (ctx) => question.replyWithMarkdown(ctx, 'banana'));
    await bot.handleUpdate({
        update_id: 42,
    });
});
(0, ava_1.default)('can replyWithMarkdownV2 the question correctly', async (t) => {
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = async (text, extra) => {
            t.is(text, 'banana' + question.messageSuffixMarkdown());
            t.deepEqual(extra, {
                parse_mode: 'MarkdownV2',
                reply_markup: { force_reply: true },
            });
            return {
                message_id: 42,
                date: 42,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                text: '666',
            };
        };
        return next();
    });
    bot.use(async (ctx) => question.replyWithMarkdownV2(ctx, 'banana'));
    await bot.handleUpdate({
        update_id: 42,
    });
});
(0, ava_1.default)('can replyWithHTML the question correctly', async (t) => {
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = async (text, extra) => {
            t.is(text, 'banana' + question.messageSuffixHTML());
            t.deepEqual(extra, {
                parse_mode: 'HTML',
                reply_markup: { force_reply: true },
            });
            return {
                message_id: 42,
                date: 42,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                text: '666',
            };
        };
        return next();
    });
    bot.use(async (ctx) => question.replyWithHTML(ctx, 'banana'));
    await bot.handleUpdate({
        update_id: 42,
    });
});
(0, ava_1.default)('ignores different update', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({
        update_id: 42,
        callback_query: {
            id: '42',
            from: { id: 42, is_bot: false, first_name: 'Bob' },
            chat_instance: '42',
            data: '666',
        },
    });
});
(0, ava_1.default)('ignores different message', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'unrelated',
        },
    });
});
(0, ava_1.default)('ignores message replying to something else', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'unrelated',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                text: 'whatever',
            },
        },
    });
});
(0, ava_1.default)('ignores message replying to something else with entities', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'unrelated',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                text: 'whatever',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/EdJoPaTo',
                        offset: 0,
                        length: 2,
                    }],
            },
        },
    });
});
(0, ava_1.default)('ignores message replying to another question', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', () => {
        t.fail();
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.pass();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'unrelated',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                text: 'whatever',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#other#',
                        offset: 0,
                        length: 2,
                    }],
            },
        },
    });
});
(0, ava_1.default)('correctly works with text message', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', ctx => {
        t.is(ctx.message.message_id, 42);
        t.is(ctx.message.reply_to_message.message_id, 43);
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.fail();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'the answer',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                text: 'whatever',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#unicorns#',
                        offset: 0,
                        length: 2,
                    }],
            },
        },
    });
});
(0, ava_1.default)('correctly works with text message with additional state', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', (ctx, additionalState) => {
        t.is(ctx.message.message_id, 42);
        t.is(ctx.message.reply_to_message.message_id, 43);
        t.is(additionalState, 'explode');
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.fail();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'the answer',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                text: 'whatever',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#unicorns#explode',
                        offset: 0,
                        length: 2,
                    }],
            },
        },
    });
});
(0, ava_1.default)('additional state url encoding is removed before passed to function', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', (ctx, additionalState) => {
        t.is(ctx.message.message_id, 42);
        t.is(ctx.message.reply_to_message.message_id, 43);
        t.is(additionalState, 'foo bar');
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.fail();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'the answer',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                text: 'whatever',
                entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#unicorns#foo%20bar',
                        offset: 0,
                        length: 2,
                    }],
            },
        },
    });
});
(0, ava_1.default)('correctly works with media message', async (t) => {
    const bot = new grammy_1.Bot('123:ABC');
    bot.botInfo = {};
    const question = new index_js_1.StatelessQuestion('unicorns', ctx => {
        t.is(ctx.message.message_id, 42);
        t.is(ctx.message.reply_to_message.message_id, 43);
    });
    bot.use(question.middleware());
    bot.use(() => {
        t.fail();
    });
    await bot.handleUpdate({
        update_id: 42,
        message: {
            message_id: 42,
            from: { id: 42, first_name: 'Bob', is_bot: true },
            chat: { id: 42, type: 'private', first_name: 'Bob' },
            date: 42,
            text: 'the answer',
            // @ts-expect-error missing some keys
            reply_to_message: {
                message_id: 43,
                from: { id: 42, first_name: 'Bob', is_bot: true },
                chat: { id: 42, type: 'private', first_name: 'Bob' },
                date: 10,
                photo: [],
                caption: 'whatever',
                caption_entities: [{
                        type: 'text_link',
                        url: 'http://t.me/#unicorns#',
                        offset: 0,
                        length: 2,
                    }],
            },
        },
    });
});
