
import { FluentBundle } from '../deps.deno.ts';
import { TranslationContext } from '../fluent.ts';


export interface WarningHandler {
  handleWarning: (warning: Warning) => void;
}

export type Warning = (
  | TranslateBundleMissingMessageWarning
  | TranslateMessageMissingAttributeWarning
  | TranslateMissingTranslationWarning
);

export interface BaseWarning {
  type: string;
}

export interface TranslateWarning extends BaseWarning {
  locales: string[];
  path: string;
  matchedBundles: Set<FluentBundle>;
  context?: TranslationContext;
}

export interface TranslateBundleMissingMessageWarning
  extends TranslateWarning
{
  type: 'translate.bundle.missing-message';
  messageId: string;
  bundle: FluentBundle;
}

export interface TranslateMessageMissingAttributeWarning
  extends TranslateWarning
{
  type: 'translate.message.missing-attribute';
  messageId: string;
  attributeName: string;
  bundle: FluentBundle;
}

export interface TranslateMissingTranslationWarning
  extends TranslateWarning
{
  type: 'translate.missing-translation';
}
