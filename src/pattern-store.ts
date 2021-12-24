
import { Pattern } from '@fluent/bundle/esm/ast';

export type MessageId = string;
export type AttributeName = string;

export interface GetPatternOptions {
  callee?: PatternStore;
  messageId: MessageId;
  attributeName?: AttributeName;
  skipParent?: boolean;
}


export interface PatternStore {

  setParentStore?: (store: PatternStore) => void;

  getPattern(
    options: GetPatternOptions

  ): Pattern | undefined;

}
