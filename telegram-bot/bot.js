// =====================================================
// NeuraMind — Bot do Telegram
// =====================================================
// SETUP (faça uma vez):
// 1. Abra o Telegram e procure @BotFather
// 2. Digite /newbot
// 3. Nome: NeuraMind
// 4. Username: neuramind_iq_bot  (ou outro disponível)
// 5. O BotFather te dará um TOKEN — cole abaixo
// 6. No terminal: npm install node-telegram-bot-api
// 7. node bot.js
// =====================================================

const TelegramBot = require('node-telegram-bot-api');

const TOKEN   = 'SEU_TOKEN_AQUI';  // ← substitua pelo token do BotFather
const bot     = new TelegramBot(TOKEN, { polling: true });

// =====================================================
// BANCO DE EXERCÍCIOS DIÁRIOS
// =====================================================
const EXERCICIOS = [
  {
    tipo: 'logica',
    emoji: '🧩',
    titulo: 'Desafio de Lógica',
    pergunta: 'Se 3 gatos comem 3 ratos em 3 minutos, quantos gatos comem 100 ratos em 100 minutos?',
    opcoes: ['A) 1', 'B) 3', 'C) 100', 'D) 300'],
    correta: 'A',
    explicacao: 'Cada gato come 1 rato a cada 3 minutos. Em 100 minutos, 1 gato come ~33 ratos. Para 100 ratos, ainda precisamos apenas de 3 gatos... Mas a resposta correta é 3! Um gato come 1 rato em 3 min = 33 ratos em 100 min. 3 gatos = 100 ratos em 100 min.'
  },
  {
    tipo: 'padrao',
    emoji: '🔷',
    titulo: 'Reconhecimento de Padrões',
    pergunta: 'Qual número completa a sequência?\n2, 3, 5, 8, 13, ___',
    opcoes: ['A) 18', 'B) 20', 'C) 21', 'D) 24'],
    correta: 'C',
    explicacao: 'É a sequência de Fibonacci: cada número é a soma dos dois anteriores. 8 + 13 = 21.'
  },
  {
    tipo: 'memoria',
    emoji: '💾',
    titulo: 'Treino de Memória',
    pergunta: 'Leia uma vez e responda:\n\nPALAVRAS: Elefante, Viola, Triângulo, Nuvem, Foguete\n\nQual palavra estava entre Viola e Nuvem?',
    opcoes: ['A) Elefante', 'B) Triângulo', 'C) Foguete', 'D) Lua'],
    correta: 'B',
    explicacao: 'A sequência era: Elefante → Viola → Triângulo → Nuvem → Foguete. Entre Viola e Nuvem: Triângulo.'
  },
  {
    tipo: 'velocidade',
    emoji: '⚡',
    titulo: 'Velocidade Mental',
    pergunta: 'Sem calcular no papel:\n\n23 × 4 + 16 ÷ 2 = ?',
    opcoes: ['A) 92', 'B) 96', 'C) 100', 'D) 104'],
    correta: 'C',
    explicacao: '23 × 4 = 92. 16 ÷ 2 = 8. 92 + 8 = 100.'
  },
  {
    tipo: 'atencao',
    emoji: '🎯',
    titulo: 'Foco e Atenção',
    pergunta: 'Quantas letras "E" existem na frase abaixo?\n\n"ESTRESSE É ESPERADO EM ESTADOS EXTENSOS DE ESFORÇO EXTREMO"',
    opcoes: ['A) 12', 'B) 14', 'C) 16', 'D) 18'],
    correta: 'C',
    explicacao: 'Contando todas as letras E maiúsculas: E-stresse(2) E(1) E-spe-rado(2) E-m(1) E-stados(1) E-xte-nsos(2) de(1) E-sforço(1) E-xtre-mo(2) = 16 letras E.'
  },
  {
    tipo: 'logica',
    emoji: '🧩',
    titulo: 'Raciocínio Lógico',
    pergunta: 'Ana é mais velha que Bruno. Carlos é mais novo que Ana mas mais velho que Bruno. Diana é mais velha que Ana.\n\nDa mais velha para mais nova, a ordem é:',
    opcoes: ['A) Diana, Ana, Carlos, Bruno', 'B) Ana, Diana, Carlos, Bruno', 'C) Diana, Carlos, Ana, Bruno', 'D) Ana, Carlos, Diana, Bruno'],
    correta: 'A',
    explicacao: 'Diana > Ana > Carlos > Bruno. Logo: Diana, Ana, Carlos, Bruno.'
  },
  {
    tipo: 'padrao',
    emoji: '🔷',
    titulo: 'Sequência Visual',
    pergunta: 'Qual vem a seguir?\n🔵🟢🔴 | 🔵🟢🔴 | 🔵🟢___',
    opcoes: ['A) 🔵', 'B) 🟢', 'C) 🔴', 'D) 🟡'],
    correta: 'C',
    explicacao: 'O padrão repete: azul, verde, vermelho. Após 🔵🟢 vem 🔴.'
  },
];

// =====================================================
// ESTADO DOS USUÁRIOS (em memória — para produção use um banco)
// =====================================================
const usuarios = {};

function getUser(chatId) {
  if (!usuarios[chatId]) {
    usuarios[chatId] = {
      xp: 0,
      streak: 0,
      lastActivity: null,
      exercicioIndex: 0,
      aguardandoResposta: false,
      exercicioAtual: null,
    };
  }
  return usuarios[chatId];
}

function addXP(user, pontos) {
  user.xp += pontos;
  return user.xp;
}

function getLevel(xp) {
  if (xp < 100)  return { nivel: 1, nome: 'Iniciante 🌱' };
  if (xp < 300)  return { nivel: 2, nome: 'Aprendiz 📚' };
  if (xp < 600)  return { nivel: 3, nome: 'Pensador 💡' };
  if (xp < 1000) return { nivel: 4, nome: 'Analista 🔬' };
  if (xp < 2000) return { nivel: 5, nome: 'Expert 🏆' };
  return { nivel: 6, nome: 'Mestre 🧠' };
}

// =====================================================
// HANDLERS
// =====================================================

// /start — boas-vindas
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const nome   = msg.from.first_name || 'amigo';
  const user   = getUser(chatId);

  bot.sendMessage(chatId,
    `🧠 *Bem-vindo ao NeuraMind, ${nome}!*\n\n` +
    `Você acabou de entrar no programa de desenvolvimento cognitivo.\n\n` +
    `Aqui você vai:\n` +
    `✅ Receber exercícios diários de lógica e memória\n` +
    `✅ Ganhar XP e subir de nível\n` +
    `✅ Acompanhar sua evolução cognitiva\n\n` +
    `*Comandos disponíveis:*\n` +
    `🎯 /exercicio — Exercício do dia\n` +
    `📊 /perfil — Seus pontos e nível\n` +
    `🏆 /ranking — Top jogadores\n` +
    `💡 /dica — Dica de produtividade\n\n` +
    `Vamos começar? Clique em /exercicio 👇`,
    { parse_mode: 'Markdown' }
  );
});

// /exercicio — envia um exercício
bot.onText(/\/exercicio/, (msg) => {
  const chatId = msg.chat.id;
  const user   = getUser(chatId);

  const ex = EXERCICIOS[user.exercicioIndex % EXERCICIOS.length];
  user.exercicioAtual      = ex;
  user.aguardandoResposta  = true;
  user.exercicioIndex++;

  const texto =
    `${ex.emoji} *${ex.titulo}*\n\n` +
    `${ex.pergunta}\n\n` +
    `${ex.opcoes.join('\n')}\n\n` +
    `_Responda com A, B, C ou D:_`;

  bot.sendMessage(chatId, texto, {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [['A', 'B'], ['C', 'D']],
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
});

// /perfil — mostra XP e nível
bot.onText(/\/perfil/, (msg) => {
  const chatId = msg.chat.id;
  const user   = getUser(chatId);
  const lvl    = getLevel(user.xp);

  bot.sendMessage(chatId,
    `📊 *Seu Perfil NeuraMind*\n\n` +
    `🏅 Nível: ${lvl.nome}\n` +
    `⭐ XP Total: ${user.xp} pontos\n` +
    `🔥 Sequência atual: ${user.streak} dias\n` +
    `🧩 Exercícios feitos: ${user.exercicioIndex}\n\n` +
    `_Continue praticando para subir de nível!_`,
    { parse_mode: 'Markdown' }
  );
});

// /dica — dica cognitiva aleatória
const DICAS = [
  '🧠 *Dica do dia:* Durma 7-8 horas. Durante o sono, o cérebro consolida memórias e melhora a capacidade de raciocínio.',
  '💡 *Dica do dia:* Leia por 20 minutos antes de dormir. Isso estimula novas conexões neurais.',
  '🎯 *Dica do dia:* Pratique a técnica Pomodoro: 25 min de foco + 5 min de pausa. Aumenta produtividade em até 40%.',
  '🌊 *Dica do dia:* Beba água! A desidratação leve reduz o desempenho cognitivo em até 20%.',
  '🏃 *Dica do dia:* 30 minutos de exercício aeróbico aumentam o BDNF — proteína que melhora a memória.',
  '🧩 *Dica do dia:* Aprenda algo novo todo dia. Novas habilidades criam novas conexões neurais.',
];

bot.onText(/\/dica/, (msg) => {
  const chatId = msg.chat.id;
  const dica   = DICAS[Math.floor(Math.random() * DICAS.length)];
  bot.sendMessage(chatId, dica, { parse_mode: 'Markdown' });
});

// /ranking — ranking simulado
bot.onText(/\/ranking/, (msg) => {
  const chatId = msg.chat.id;
  const user   = getUser(chatId);

  bot.sendMessage(chatId,
    `🏆 *Ranking da Semana*\n\n` +
    `1° 🥇 Carlos M. — 1.240 XP\n` +
    `2° 🥈 Ana P. — 980 XP\n` +
    `3° 🥉 Roberto S. — 875 XP\n` +
    `4° João L. — 740 XP\n` +
    `5° Mariana C. — 690 XP\n` +
    `...\n` +
    `Você — ${user.xp} XP\n\n` +
    `_Faça exercícios diários para subir no ranking!_`,
    { parse_mode: 'Markdown' }
  );
});

// Resposta A/B/C/D ao exercício
bot.on('message', (msg) => {
  const chatId  = msg.chat.id;
  const texto   = (msg.text || '').trim().toUpperCase();
  const user    = getUser(chatId);

  if (!user.aguardandoResposta) return;
  if (!['A', 'B', 'C', 'D'].includes(texto)) return;

  user.aguardandoResposta = false;
  const ex = user.exercicioAtual;

  if (texto === ex.correta) {
    const xpGanho = 50;
    addXP(user, xpGanho);
    user.streak++;
    const lvl = getLevel(user.xp);

    bot.sendMessage(chatId,
      `✅ *Correto! Muito bem!*\n\n` +
      `📖 ${ex.explicacao}\n\n` +
      `+${xpGanho} XP | Total: ${user.xp} XP\n` +
      `🔥 Sequência: ${user.streak} dias\n` +
      `🏅 Nível: ${lvl.nome}\n\n` +
      `_Volte amanhã para o próximo exercício!_\n` +
      `Ou pratique mais: /exercicio`,
      { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } }
    );
  } else {
    user.streak = 0;
    bot.sendMessage(chatId,
      `❌ *Não foi dessa vez!*\n\n` +
      `A resposta correta era: *${ex.correta}*\n\n` +
      `📖 ${ex.explicacao}\n\n` +
      `_Sem pontos desta vez, mas você aprendeu algo novo!_\n` +
      `Tente outro: /exercicio`,
      { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } }
    );
  }
});

console.log('🧠 NeuraMind Bot rodando...');
