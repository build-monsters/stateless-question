import {type Context as BaseContext} from 'grammy';
import {
  isContextReplyToMessage,
  isReplyToQuestion,
  type ReplyToMessageContext,
  suffixHTML,
  suffixMarkdown,
  suffixMarkdownV2,
} from './identifier.js';

type ConstOrPromise<T> = T | Promise<T>;
export let questions: any[] = []

export class StatelessQuestion<Context extends BaseContext> {
  constructor(
    public readonly uniqueIdentifier: string,
    private readonly answer: (
      context: ReplyToMessageContext<Context>,
      additionalState: string,
    ) => ConstOrPromise<void>,
  ) {
  }

  middleware(): (context: Context, next: () => Promise<void>) => Promise<void> {
    return async (context, next) => {
      if (
        // @ts-ignore
        (context.message && context.message.text && this.inQuestions(context.from.id, this.uniqueIdentifier)) ||
        (isContextReplyToMessage(context) && isReplyToQuestion(context, this.uniqueIdentifier))
      ) {
        // @ts-ignore
        return this.answer(context, context.user.scene.split('/')[0] + '/');
      }

      await next();
    };
  }

  messageSuffixHTML(additionalState?: string): string {
    return suffixHTML(this.uniqueIdentifier, additionalState);
  }

  messageSuffixMarkdown(additionalState?: string): string {
    return suffixMarkdown(this.uniqueIdentifier, additionalState);
  }

  messageSuffixMarkdownV2(additionalState?: string): string {
    return suffixMarkdownV2(this.uniqueIdentifier, additionalState);
  }

  async replyWithHTML(
    context: BaseContext,
    text: string,
    additionalState?: string,
  ) {
    questions.push([context.from?.id, this.uniqueIdentifier])
    const textResult = text + this.messageSuffixHTML(additionalState);
    return context.reply(textResult, {
      reply_markup: {force_reply: true},
      parse_mode: 'HTML',
    });
  }

  async replyWithMarkdown(
    context: BaseContext,
    text: string,
    additionalState?: string,
  ) {
    questions.push([context.from?.id, this.uniqueIdentifier])
    const textResult = text + this.messageSuffixMarkdown(additionalState);
    return context.reply(textResult, {
      reply_markup: {force_reply: true},
      parse_mode: 'Markdown',
    });
  }

  async replyWithMarkdownV2(
    context: BaseContext,
    text: string,
    additionalState?: string,
  ) {
    questions.push([context.from?.id, this.uniqueIdentifier])
    const textResult = text + this.messageSuffixMarkdownV2(additionalState);
    return context.reply(textResult, {
      reply_markup: {force_reply: true},
      parse_mode: 'MarkdownV2',
    });
  }

  inQuestions(id: any, need: any) {
    for (const question of questions) {
      if (question[0] == id && question[1] == need) {
        questions = this.removeItemOnce(questions, question)
        return true
      }
    }
    return false
  }

  removeItemOnce(arr: any[], value: any) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
}
