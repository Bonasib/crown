'use client';

import * as React from 'react';

export type Lang = 'ar' | 'en';

const dict = {
  ar: {
    app_name: 'لوحة تحكم المتجر',
    dashboard: 'لوحة المعلومات',
    products: 'المنتجات',
    smm: 'خدمات السوشيال ميديا',
    coupons: 'أكواد الخصم',
    orders: 'الطلبات',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    login_title: 'تسجيل دخول المسؤول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login_button: 'دخول',
    login_error: 'بيانات الدخول غير صحيحة',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    active: 'مفعل',
    inactive: 'غير مفعل',
    name_ar: 'الاسم (عربي)',
    name_en: 'الاسم (إنجليزي)',
    cost: 'التكلفة',
    profit_percent: 'نسبة الربح %',
    delivery_type: 'نوع التسليم',
    category: 'الفئة',
    revenue_stars: 'الإيرادات (نجوم)',
    profit_estimate: 'الربح المقدر',
    total_products: 'عدد المنتجات',
    total_smm_services: 'خدمات السوشيال',
    active_coupons: 'أكواد نشطة',
    orders_by_status: 'الطلبات حسب الحالة',
    catalog_limit: 'الحد الأقصى 200 منتج',
  },
  en: {
    app_name: 'Shop Admin Panel',
    dashboard: 'Dashboard',
    products: 'Products',
    smm: 'SMM Services',
    coupons: 'Coupons',
    orders: 'Orders',
    settings: 'Settings',
    logout: 'Logout',
    login_title: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login_button: 'Sign in',
    login_error: 'Invalid credentials',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    active: 'Active',
    inactive: 'Inactive',
    name_ar: 'Name (Arabic)',
    name_en: 'Name (English)',
    cost: 'Cost',
    profit_percent: 'Profit %',
    delivery_type: 'Delivery Type',
    category: 'Category',
    revenue_stars: 'Revenue (Stars)',
    profit_estimate: 'Estimated Profit',
    total_products: 'Total Products',
    total_smm_services: 'SMM Services',
    active_coupons: 'Active Coupons',
    orders_by_status: 'Orders by Status',
    catalog_limit: 'Capped at 200 products',
  },
} as const;

export type DictKey = keyof (typeof dict)['ar'];

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: DictKey) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>('ar');

  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('shop_admin_lang') as Lang | null) : null;
    if (stored === 'ar' || stored === 'en') setLangState(stored);
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('shop_admin_lang', l);
  }, []);

  const t = React.useCallback((key: DictKey) => dict[lang][key], [lang]);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  React.useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return <I18nContext.Provider value={{ lang, setLang, t, dir }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
