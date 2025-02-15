import { type Context as BaseContext } from 'grammy';
import { type Message, type MessageEntity } from 'grammy/types';
type ReplyToMessage = NonNullable<Message.CommonMessage['reply_to_message']>;
export type ReplyToMessageContext<Context extends BaseContext> = Context & {
    message: Message.CommonMessage & {
        reply_to_message: ReplyToMessage;
    };
};
export type UrlMessageEntity = Readonly<MessageEntity.TextLinkMessageEntity>;
export declare function isContextReplyToMessage<Context extends BaseContext>(context: Context): context is ReplyToMessageContext<Context>;
export declare function isReplyToQuestion<Context extends BaseContext>(context: ReplyToMessageContext<Context>, identifier: string): boolean;
export declare function getAdditionalState<Context extends BaseContext>(context: ReplyToMessageContext<Context>, identifier: string): string;
export declare function suffixMarkdown(identifier: string, additionalState: string | undefined): string;
export declare function suffixMarkdownV2(identifier: string, additionalState: string | undefined): string;
export declare function suffixHTML(identifier: string, additionalState: string | undefined): string;
export {};
