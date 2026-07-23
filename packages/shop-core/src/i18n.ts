export type Lang = 'ar' | 'en';

export const DEFAULT_LANG: Lang = 'ar';

type Dict = Record<string, string>;

const ar: Dict = {
  welcome: 'أهلاً بك 👑\nاختر من القائمة أدناه:',
  menu_products: '🛒 المنتجات الرقمية',
  menu_smm: '📈 خدمات السوشيال ميديا',
  menu_orders: '🎟 طلباتي',
  menu_language: '🌐 اللغة',
  menu_help: 'ℹ️ الدعم',
  choose_language: 'اختر اللغة / Choose language:',
  language_set: '✅ تم تعيين اللغة إلى العربية.',
  back: '⬅️ رجوع',
  no_categories: 'لا توجد فئات متاحة حالياً.',
  no_products: 'لا توجد منتجات في هذه الفئة حالياً.',
  no_services: 'لا توجد خدمات متاحة حالياً.',
  product_price: 'السعر: {price} ⭐',
  buy_button: '💳 شراء الآن',
  enter_coupon: 'هل لديك كود خصم؟ أرسله الآن أو اضغط "تخطي".',
  skip: 'تخطي',
  coupon_invalid: '❌ كود الخصم غير صالح أو منتهي.',
  coupon_applied: '✅ تم تطبيق الخصم: -{amount} ⭐',
  order_summary: 'ملخص الطلب:\n{name}\nالكمية: {quantity}\nالإجمالي: {total} ⭐',
  confirm_invoice_sent: '🧾 تم إرسال فاتورة الدفع أعلاه. أكمل الدفع بنجوم تيليجرام ⭐ لإتمام الطلب.',
  payment_processing: '🔄 جارٍ تأكيد الدفع...',
  payment_confirmed: '✅ تم تأكيد الدفع بنجاح!',
  order_preparing: '📦 جارٍ تجهيز طلبك...',
  order_delivered_text: '🎁 إليك منتجك:',
  order_delivered_file_caption: '📎 ملف طلبك',
  order_failed: '⚠️ حدث خطأ في تجهيز الطلب. سيتم التواصل معك من الدعم.',
  smm_ask_link: 'أرسل رابط الملف الشخصي/المنشور:',
  smm_ask_quantity: 'أدخل الكمية المطلوبة (بين {min} و {max}):',
  smm_invalid_quantity: '❌ كمية غير صالحة. أدخل رقماً بين {min} و {max}.',
  smm_order_placed: '✅ تم إرسال طلبك إلى المزوّد. رقم المتابعة: {providerOrderId}',
  smm_order_status: 'حالة الطلب: {status}',
  no_orders: 'لا توجد طلبات سابقة.',
  order_line: '#{id} — {status} — {total} ⭐',
  help_text: 'للدعم تواصل معنا: @{support}',
  out_of_stock: '❌ نفدت الكمية من هذا المنتج مؤقتاً.',
  affiliate_new_earning: '💰 عمولة جديدة! ربحت {amount} ⭐ من إحالة كود {code}.',
};

const en: Dict = {
  welcome: 'Welcome 👑\nChoose an option below:',
  menu_products: '🛒 Digital Products',
  menu_smm: '📈 SMM Services',
  menu_orders: '🎟 My Orders',
  menu_language: '🌐 Language',
  menu_help: 'ℹ️ Support',
  choose_language: 'Choose language / اختر اللغة:',
  language_set: '✅ Language set to English.',
  back: '⬅️ Back',
  no_categories: 'No categories available right now.',
  no_products: 'No products in this category yet.',
  no_services: 'No services available right now.',
  product_price: 'Price: {price} ⭐',
  buy_button: '💳 Buy Now',
  enter_coupon: 'Have a coupon code? Send it now or press "Skip".',
  skip: 'Skip',
  coupon_invalid: '❌ Coupon code is invalid or expired.',
  coupon_applied: '✅ Discount applied: -{amount} ⭐',
  order_summary: 'Order summary:\n{name}\nQuantity: {quantity}\nTotal: {total} ⭐',
  confirm_invoice_sent: '🧾 Invoice sent above. Complete payment with Telegram Stars ⭐ to finish your order.',
  payment_processing: '🔄 Confirming payment...',
  payment_confirmed: '✅ Payment confirmed!',
  order_preparing: '📦 Preparing your order...',
  order_delivered_text: '🎁 Here is your product:',
  order_delivered_file_caption: '📎 Your order file',
  order_failed: '⚠️ Something went wrong preparing your order. Support will contact you.',
  smm_ask_link: 'Send the profile/post link:',
  smm_ask_quantity: 'Enter the quantity (between {min} and {max}):',
  smm_invalid_quantity: '❌ Invalid quantity. Enter a number between {min} and {max}.',
  smm_order_placed: '✅ Order submitted to the provider. Tracking ID: {providerOrderId}',
  smm_order_status: 'Order status: {status}',
  no_orders: 'No past orders.',
  order_line: '#{id} — {status} — {total} ⭐',
  help_text: 'Contact support: @{support}',
  out_of_stock: '❌ This product is temporarily out of stock.',
  affiliate_new_earning: '💰 New commission! You earned {amount} ⭐ from coupon {code}.',
};

const dictionaries: Record<Lang, Dict> = { ar, en };

export function t(lang: Lang, key: keyof typeof ar, vars?: Record<string, string | number>): string {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
  let str = dict[key] ?? dictionaries[DEFAULT_LANG][key] ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}

export function localized(lang: Lang, ar_: string, en_: string): string {
  return lang === 'en' ? en_ : ar_;
}
