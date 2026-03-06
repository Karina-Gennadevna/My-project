import FadeUp from './FadeUp';

const forList = [
  'Владельцы бизнеса (5–150 человек) с операционными проблемами',
  'Операционные директора, управляющие хаосом',
  'Руководители, которые хотят масштабировать без найма армии менеджеров',
  'Компании, планирующие автоматизацию или внедрение AI-инструментов',
  'Те, кто чувствует: что-то идёт не так, но непонятно где',
  'Бизнесы, где есть команда и процессы — но нет управляемости',
];

const notForList = [
  'Стартапы без процессов и сложившейся команды',
  'Те, кто ищет мотивацию и вдохновение, а не анализ',
  'Бизнесы, где "всё и так нормально работает"',
  'Если вам нужен консалтинг, а не диагностика',
  'Ожидающие быструю волшебную таблетку',
  'Компании, не готовые к честному взгляду на свои процессы',
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="8" fill="rgba(16,185,129,0.12)" />
      <path d="M4.5 8.5L7 11L11.5 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="8" fill="rgba(239,68,68,0.1)" />
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ForWhom() {
  return (
    <section id="for-whom" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Аудитория</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Кому подходит K-AQS™
            </h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-4">
          {/* For */}
          <FadeUp delay={100}>
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 p-7 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-100">Для кого</h3>
              </div>
              <ul className="space-y-3">
                {forList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          {/* Not for */}
          <FadeUp delay={200}>
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 p-7 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-100">Кому не подходит</h3>
              </div>
              <ul className="space-y-3">
                {notForList.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                    <CrossIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
