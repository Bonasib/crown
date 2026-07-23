import { InlineKeyboard } from 'grammy';
import { t, type Lang } from '@ronda/shop-core';

export function mainMenuKeyboard(lang: Lang): InlineKeyboard {
  return new InlineKeyboard()
    .text(t(lang, 'menu_products'), 'menu:products')
    .row()
    .text(t(lang, 'menu_smm'), 'menu:smm')
    .row()
    .text(t(lang, 'menu_orders'), 'menu:orders')
    .row()
    .text(t(lang, 'menu_language'), 'menu:language')
    .text(t(lang, 'menu_help'), 'menu:help');
}

export function languageKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text('🇸🇦 العربية', 'lang:ar').text('🇬🇧 English', 'lang:en');
}

export function backButton(lang: Lang, target: string): InlineKeyboard {
  return new InlineKeyboard().text(t(lang, 'back'), target);
}
