import { type Context as BaseContext } from 'grammy';
import { type ReplyToMessageContext } from './identifier.js';
type ConstOrPromise<T> = T | Promise<T>;
export declare let questions: any[];
export declare class StatelessQuestion<Context extends BaseContext> {
    readonly uniqueIdentifier: string;
    private readonly answer;
    constructor(uniqueIdentifier: string, answer: (context: ReplyToMessageContext<Context>, additionalState: string) => ConstOrPromise<void>);
    middleware(): (context: Context, next: () => Promise<void>) => Promise<void>;
    messageSuffixHTML(additionalState?: string): string;
    messageSuffixMarkdown(additionalState?: string): string;
    messageSuffixMarkdownV2(additionalState?: string): string;
    replyWithHTML(context: BaseContext, text: string, additionalState?: string): Promise<import("@grammyjs/types").Message.TextMessage>;
    replyWithMarkdown(context: BaseContext, text: string, additionalState?: string): Promise<import("@grammyjs/types").Message.TextMessage>;
    replyWithMarkdownV2(context: BaseContext, text: string, additionalState?: string): Promise<import("@grammyjs/types").Message.TextMessage>;
    inQuestions(id: any, need: any): boolean;
    removeItemOnce(arr: any[], value: any): any[];
}
export {};
