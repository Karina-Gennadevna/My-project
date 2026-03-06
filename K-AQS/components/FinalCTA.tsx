'use client';

import { useState } from 'react';
import FadeUp from './FadeUp';

const roles = [
  'Владелец бизнеса',
  'Генеральный директор',
  'Операционный директор',
  'Руководитель команды',
  'Другое',
];

const teamSizes = ['5–15 человек', '16–50 человек', '51–150 человек', '150+ человек'];

interface FormState {
  name: string;
  contact: string;
  role: string;
  teamSize: string;
  comment: string;
}

const EMPTY: FormState = { name: '', contact: '', role: '', teamSize: '', comment: '' };

export default function FinalCTA() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Укажите имя';
    if (!form.contact.trim()) {
      newErrors.contact = 'Укажите email или Telegram';
    } else if (
      !form.contact.includes('@') &&
      !form.contact.startsWith('@') &&
      !/^\+?\d{7,}$/.test(form.contact.replace(/\s/g, ''))
    ) {
      newErrors.contact = 'Неверный формат email или Telegram (@username)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log('[K-AQS] Form submitted:', form);
    setSubmitted(true);
    setForm(EMPTY);
    setErrors({});

    setToast('Заявка отправлена. Мы свяжемся с вами в течение 24 часов.');
    setTimeout(() => setToast(null), 5000);
  };

  const field = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <section id="start" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Записаться</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Пройти диагностику K-AQS™
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Заполните форму — мы пришлём доступ к опроснику в течение 24 часов. Без предоплаты.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center py-16 px-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L9.5 16.5L19 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">Заявка принята</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Мы свяжемся с вами в течение 24 часов и пришлём доступ к опроснику.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost mt-6 text-sm py-2 px-5 mx-auto"
                >
                  Оставить ещё одну заявку
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-white/[0.08] bg-gray-900/60 p-7 sm:p-9 space-y-5"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Имя <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => field('name', e.target.value)}
                    placeholder="Как к вам обращаться"
                    className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.06] ${
                      errors.name ? 'border-red-500/50' : 'border-white/[0.1]'
                    }`}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                  />
                  {errors.name && (
                    <p id="err-name" className="text-xs text-red-400 mt-1.5">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email или Telegram <span className="text-blue-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => field('contact', e.target.value)}
                    placeholder="name@company.com или @username"
                    className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.06] ${
                      errors.contact ? 'border-red-500/50' : 'border-white/[0.1]'
                    }`}
                    aria-describedby={errors.contact ? 'err-contact' : undefined}
                  />
                  {errors.contact && (
                    <p id="err-contact" className="text-xs text-red-400 mt-1.5">
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Role + Team size */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Роль
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => field('role', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-gray-100 outline-none transition-all duration-200 focus:border-blue-500/50 appearance-none cursor-pointer"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="" disabled style={{ background: '#111827' }}>
                        Выберите роль
                      </option>
                      {roles.map((r) => (
                        <option key={r} value={r} style={{ background: '#111827' }}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Размер команды
                    </label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => field('teamSize', e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-gray-100 outline-none transition-all duration-200 focus:border-blue-500/50 appearance-none cursor-pointer"
                      style={{ backgroundImage: 'none' }}
                    >
                      <option value="" disabled style={{ background: '#111827' }}>
                        Выберите размер
                      </option>
                      {teamSizes.map((s) => (
                        <option key={s} value={s} style={{ background: '#111827' }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Коротко о ситуации{' '}
                    <span className="text-gray-600 font-normal">(необязательно)</span>
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => field('comment', e.target.value)}
                    placeholder="Что происходит в бизнесе, что привело вас сюда"
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.06] resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3.5 text-sm">
                  Отправить заявку
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M9 4L13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <p className="text-xs text-gray-600 text-center">
                  Никакого спама. Только доступ к опроснику и дальнейшее по вашему желанию.
                </p>
              </form>
            )}
          </div>
        </FadeUp>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <div className="flex items-start gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
              <path d="M3 8L6.5 11.5L13 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {toast}
          </div>
        </div>
      )}
    </section>
  );
}
