import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Calendar,
  BookOpen,
  Users,
  BrainCircuit,
  MessageSquare,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AIAssistantView = () => {
  const { role, currentSchool, language, addToast, t } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      sender: 'ai',
      text: language === 'tj' 
        ? `Салом! Ман Smart School AI — ёвари зеҳнии мактаби шумо ҳастам. Ман метавонам дар тартиб додани ҷадвали дарсҳо, таҳлили давомот, пайдо кардани ҷойгузини омӯзгорон ва навиштани эълонҳо кӯмак кунам. Чӣ кор карда метавонам?`
        : language === 'en'
        ? `Hello! I am Smart School AI — your intelligent school assistant. I can help optimize schedules, analyze student performance, suggest teacher substitutions, and draft announcements. How can I assist you today?`
        : `Здравствуйте! Я Smart School AI — интеллектуальный ассистент вашей школы. Я помогаю составлять расписание без коллизий, подбирать замены учителям, анализировать успеваемость и создавать учебные материалы. Чем могу помочь?`,
      time: '12:00'
    }
  ];

  const [messages, setMessages] = useState(initialMessages);

  const quickPrompts = [
    {
      title: language === 'tj' ? 'Ҷадвали дарсҳо' : language === 'en' ? 'Optimize Schedule' : 'Оптимизация расписания',
      desc: language === 'tj' ? 'Санҷиши бархӯрдҳо ва коллизияҳо' : language === 'en' ? 'Check and resolve slot conflicts' : 'Проверить и устранить накладки',
      prompt: language === 'tj' ? 'Ҷадвали рӯзи чоршанберо таҳлил кун ва бархӯрдҳои эҳтимолиро муайян намо.' : language === 'en' ? 'Analyze Wednesday schedule and detect room/teacher conflicts.' : 'Проанализируй расписание на среду и найди возможные окна и конфликты кабинетов.'
    },
    {
      title: language === 'tj' ? 'Ивазкунии омӯзгор' : language === 'en' ? 'Teacher Substitution' : 'Подобрать замену',
      desc: language === 'tj' ? 'Омӯзгори озод барои дарс' : language === 'en' ? 'Find available substitute teacher' : 'Найти свободного учителя на урок',
      prompt: language === 'tj' ? 'Омӯзгори математика бемор шудааст. Барои синфи 7А ба ҷои ӯ киро гузоштан мумкин аст?' : language === 'en' ? 'Math teacher is absent. Suggest a free replacement teacher for grade 7A.' : 'Учитель алгебры отсутствует. Кто из свободных преподавателей может выйти на замену в 7А на 3-м уроке?'
    },
    {
      title: language === 'tj' ? 'Таҳлили баҳоҳо' : language === 'en' ? 'Grade Analytics' : 'Анализ успеваемости',
      desc: language === 'tj' ? 'Ҳисоботи пешрафти синфҳо' : language === 'en' ? 'Class academic trends report' : 'Сводка по сложным предметам',
      prompt: language === 'tj' ? 'Барои синфи 9Б ҳисоботи мухтасари баҳоҳоро омода кун.' : language === 'en' ? 'Generate a brief summary of grade distribution for grade 9B.' : 'Сформируй краткий аналитический отчёт по средней успеваемости 9Б класса.'
    },
    {
      title: language === 'tj' ? 'Эълон ба волидон' : language === 'en' ? 'Parent Notice' : 'Объявление родителям',
      desc: language === 'tj' ? 'Матни маҷлиси падару модарон' : language === 'en' ? 'Draft meeting announcement' : 'Текст о родительском собрании',
      prompt: language === 'tj' ? 'Барои волидони синфи 10А дар бораи маҷлиси рӯзи ҷумъа эълони расмӣ навис.' : language === 'en' ? 'Draft an announcement to grade 10A parents regarding Friday meeting.' : 'Составь вежливое и структурированное объявление родителям 10А класса о предстоящем собрании в пятницу в 18:00.'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes('расписан') || q.includes('ҷадвал') || q.includes('schedule') || q.includes('коллиз')) {
      return language === 'tj'
        ? `📊 **Таҳлили ҷадвали дарсҳо аз рӯи алгоритми AI:**\n\n1. Дар рӯзи чоршанбе дар синфи 7А ҳамагӣ 5 дарс ба нақша гирифта шудааст.\n2. Синфхонаи 201 (Компютерӣ) дар соати 10:45 холӣ аст ва коллизия вуҷуд надорад.\n3. Сарбории омӯзгорон дар меъёри санитарӣ қарор дорад (на бештар аз 4 дарс паиҳам).\n\n💡 *Тавсия:* Барои беҳтар намудани сифат, дарси охиринро бо дарси тарбияи ҷисмонӣ иваз кардан мумкин аст.`
        : language === 'en'
        ? `📊 **AI Timetable Analysis:**\n\n1. Wednesday schedule checked: 0 hard room or teacher conflicts detected.\n2. Classroom 201 (IT Lab) is free during slot 10:45 – 12:15.\n3. Teacher daily workload conforms to educational standards (max 4 consecutive periods).\n\n💡 *Recommendation:* Ready for publishing or fine-tuning in AI Wizard.`
        : `📊 **Анализ расписания алгоритмом AI:**\n\n1. В среду для параллели 7-х классов проверено 14 уроков. Критических наложений не обнаружено.\n2. Кабинет 201 (Информатика) свободен в слот 10:45 – 12:15.\n3. Нагрузка преподавателей распределена равномерно, «окон» более 1 урока не зафиксировано.\n\n💡 *Рекомендация:* Расписание готово к публикации в модуле «Расписание».`;
    }

    if (q.includes('замен') || q.includes('иваз') || q.includes('substitut') || q.includes('учител') || q.includes('омӯзгор')) {
      return language === 'tj'
        ? `🔄 **Пешниҳоди ҷойгузинии AI барои дарс:**\n\n- **Омӯзгори ивазкунанда:** Бобоев Темур Исломович (категорияи олӣ)\n- **Синфхона:** Кабинети 302\n- **Ҳолати дастрасӣ:** Дар ин соат дарс надорад ва озод аст.\n\nАмалиёт метавонад дар бахши «Ивазкуниҳо» бо як клик тасдиқ карда шавад.`
        : language === 'en'
        ? `🔄 **AI Substitution Recommendation:**\n\n- **Suggested Teacher:** Boboev Temur (Math department)\n- **Room:** Room 302\n- **Status:** 100% available at this period.\n\nYou can confirm this substitution in the Substitutions tab.`
        : `🔄 **Рекомендация AI по замене преподавателя:**\n\n- **Рекомендуемый учитель:** Бобоев Темур Исламович (Алгебра/Геометрия)\n- **Кабинет:** 302\n- **Статус:** Свободен в данный временной слот (нет пересечений).\n- **Совместимость программы:** 100% соответствует учебному плану параллели.\n\nЗамена может быть подтверждена в один клик в разделе «Замены уроков».`;
    }

    if (q.includes('объявлен') || q.includes('эълон') || q.includes('собрани') || q.includes('волид') || q.includes('parent')) {
      return language === 'tj'
        ? `📢 **Матни омодаи эълон барои волидон:**\n\n«Муҳтарам волидайни хонандагони синфи 10А!\n\nРӯзи ҷумъа, соати 18:00 дар мактаб маҷлиси навбатии падару модарон баргузор мегардад. Масъалаҳои баррасишаванда: ҷамъбасти баҳоҳои моҳона, омодагӣ ба олимпиадаҳо ва реҷаи таҳсил.\n\nИштироки шумо хеле муҳим аст.\nБо эҳтиром, маъмурияти мактаб.»`
        : language === 'en'
        ? `📢 **Ready-to-use Parent Announcement:**\n\n"Dear Parents and Guardians of Grade 10A!\n\nYou are cordially invited to our Parent-Teacher Meeting on Friday at 18:00 in Room 101. Topics: academic progress, upcoming olympiad prep, and school conduct.\n\nYour presence is appreciated.\nBest regards, School Administration."`
        : `📢 **Готовый текст объявления для родителей:**\n\n«Уважаемые родители учащихся 10А класса!\n\nВ эту пятницу в 18:00 в кабинете 101 состоится родительское собрание. Повестка встречи: итоги успеваемости за месяц, подготовка к олимпиадам и внутренний распорядок школы.\n\nВаше присутствие очень важно.\nС уважением, администрация школы.»`;
    }

    return language === 'tj'
      ? `🤖 Дархости шуморо коркард намудам: «${userQuery}».\n\nМаълумоти пойгоҳи додаҳо санҷида шуд. Дар системаи мактаб ҳамаи нишондиҳандаҳо устуворанд. Агар саволи мушаххас оид ба ҷадвал, баҳоҳо ё ҳайати омӯзгорон дошта бошед, бо камоли майл посух медиҳам!`
      : language === 'en'
      ? `🤖 Processed request: "${userQuery}".\n\nSystem data verified against school records. All modules are running normally. Let me know if you need specific schedule calculations, student performance reports, or staff analytics!`
      : `🤖 Запрос успешно обработан: «${userQuery}».\n\nДанные проверены по базе школы. Все модули работают штатно. Готов выполнить расчёт расписания, сгенерировать отчёт или подготовить материалы по вашему запросу.`;
  };

  const handleSendMessage = (textToSend = inputMessage) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg = {
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    addToast({ type: 'success', title: 'Скопировано', message: 'Текст скопирован в буфер обмена' });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Smart School AI Assistant
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                PRO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'tj' 
                ? 'Ёвари зеҳнӣ барои идораи мактаб, таҳлили дарсҳо ва тартиб додани ҷадвал' 
                : language === 'en'
                ? 'AI Copilot for school administration, scheduling, and student insights'
                : 'Интеллектуальный помощник для управления школой, расписанием и учебным процессом'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setMessages(initialMessages)}
          className="self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          {language === 'tj' ? 'Тоза кардани чат' : language === 'en' ? 'Reset Chat' : 'Очистить чат'}
        </Button>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.prompt)}
            className="p-3.5 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all hover:shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {item.desc}
              </p>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-3 flex items-center">
              {language === 'tj' ? 'Иҷро кардан →' : language === 'en' ? 'Execute →' : 'Применить →'}
            </span>
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <Card className="flex flex-col h-[560px] p-0 overflow-hidden border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-600/10'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  <div className="whitespace-pre-line font-normal">
                    {msg.text}
                  </div>

                  <div className={`flex items-center justify-between gap-4 mt-2 pt-1 border-t ${
                    isUser ? 'border-indigo-500/50 text-indigo-100' : 'border-slate-100 dark:border-slate-800 text-slate-400'
                  } text-[10px]`}>
                    <span>{msg.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.text, index)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                        title="Скопировать ответ"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Копировать</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 shadow-sm flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'tj'
                  ? 'Ба Smart School AI савол диҳед...'
                  : language === 'en'
                  ? 'Ask Smart School AI anything...'
                  : 'Задайте вопрос Smart School AI (например: составь расписание для 8А)...'
              }
              className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'tj' ? 'Ирсол' : language === 'en' ? 'Send' : 'Отправить'}
              </span>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
