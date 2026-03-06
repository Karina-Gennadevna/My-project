import FadeUp from './FadeUp';

const symptoms = [
  'Непонятно, кто за что отвечает — задачи теряются между людьми',
  'Каждое решение требует вашего личного участия',
  'Масштабирование приводит к хаосу, а не к росту',
  'Автоматизацию внедрили, но она не прижилась',
  'Нет понимания, где деньги утекают и почему',
  'Процессы описаны, но реально не соблюдаются',
  'Команда держится на одном-двух ключевых людях',
  'Метрики есть, но никто на них не смотрит',
  'Рост бизнеса требует пропорционального найма',
  'Делегировать не получается — контроль снова на вас',
];

function WarnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-[3px]">
      <path d="M7 1L13 12H1L7 1Z" fill="rgba(251,191,36,0.1)" stroke="#FCD34D" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 5.5V8" stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.6" fill="#FCD34D" />
    </svg>
  );
}

export default function Symptoms() {
  return (
    <section
      id="symptoms"
      className="py-20 sm:py-28"
      style={{ background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.02) 50%, transparent)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Симптомы хаоса</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Узнаёте себя?
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Если хотя бы 3–4 пункта из этого списка — про ваш бизнес, диагностика нужна сейчас.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="grid sm:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
            {symptoms.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-white/[0.07] bg-gray-900/40 hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all duration-200"
              >
                <WarnIcon />
                <span className="text-sm text-gray-400 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={200}>
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Эти симптомы — признак системной проблемы, а не кадровой или удачи.
            </p>
            <a href="#start" className="btn-primary mt-5 inline-flex">
              Пройти диагностику
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
