/* =========================================
   NeuraMind — quiz.js (versão 2)
   Fluxo: Teste → Resultado parcial → Cadastro → Kiwify
   ========================================= */

// ⚠️ SUBSTITUA pela URL do seu Google Apps Script após implantar
const APPS_SCRIPT_URL = '/.netlify/functions/salvar';

/* ---------- QUESTIONS ---------- */
const QUESTIONS = [
  { area: 'Raciocínio Lógico', text: 'Se todos os A são B, e todos os B são C, então:', options: ['Todos os A são C', 'Todos os C são A', 'Nenhum A é C', 'Alguns C são A'], correct: 0, weight: 2 },
  { area: 'Raciocínio Lógico', text: 'Qual número completa a sequência? 2, 6, 18, 54, ___', options: ['108', '162', '72', '216'], correct: 1, weight: 2 },
  { area: 'Raciocínio Lógico', text: 'Em um grupo de 30 pessoas, 18 falam inglês e 15 falam espanhol. Se 5 não falam nenhuma, quantos falam os dois?', options: ['8', '6', '10', '12'], correct: 0, weight: 3 },
  { area: 'Reconhecimento de Padrões', text: 'Qual letra vem a seguir? A, C, F, J, ___', options: ['N', 'O', 'M', 'P'], correct: 1, weight: 2 },
  { area: 'Reconhecimento de Padrões', text: 'Complete a sequência: 1, 1, 2, 3, 5, 8, ___', options: ['11', '13', '12', '10'], correct: 1, weight: 2 },
  { area: 'Reconhecimento de Padrões', text: 'Qual padrão continua? 2, 4, 8, 16, ___', options: ['24', '28', '32', '30'], correct: 2, weight: 1 },
  { area: 'Memória', text: 'Memorize estas palavras: AZUL, CASA, ESTRELA, RIO, LIVRO. Qual NÃO estava na lista?', options: ['PEDRA', 'AZUL', 'RIO', 'ESTRELA'], correct: 0, weight: 2 },
  { area: 'Memória', text: 'Qual sequência numérica apareceu numa questão anterior?', options: ['2, 6, 18, 54', '1, 3, 9, 27', '2, 4, 8, 16', '3, 6, 12, 24'], correct: 0, weight: 2 },
  { area: 'Atenção', text: 'Quantas vezes a letra "A" aparece: "A análise avalia a capacidade de atenção ativa"?', options: ['7', '8', '9', '6'], correct: 1, weight: 2 },
  { area: 'Atenção', text: 'Qual número é diferente? 8765 / 8756 / 8765 / 8765 / 8765', options: ['O segundo (8756)', 'O primeiro', 'O terceiro', 'Todos iguais'], correct: 0, weight: 2 },
  { area: 'Velocidade de Processamento', text: 'Se hoje é terça-feira, que dia será daqui a 15 dias?', options: ['Quarta', 'Quinta', 'Terça', 'Segunda'], correct: 0, weight: 1 },
  { area: 'Velocidade de Processamento', text: '17 × 8 = ?', options: ['126', '136', '144', '132'], correct: 1, weight: 1 },
  { area: 'Velocidade de Processamento', text: 'Quantos segundos tem 2,5 minutos?', options: ['120', '150', '180', '125'], correct: 1, weight: 1 },
  { area: 'Capacidade Analítica', text: 'Produto custava R$80. Aumento de 25% e desconto de 20%. Preço final?', options: ['R$80', 'R$84', 'R$76', 'R$90'], correct: 0, weight: 3 },
  { area: 'Capacidade Analítica', text: '"Todos os médicos são humanos. João é humano." Logo:', options: ['João é médico', 'João pode ou não ser médico', 'João não é médico', 'Humanos são médicos'], correct: 1, weight: 2 },
  { area: 'Capacidade Analítica', text: 'Três pessoas dividem uma tarefa. A faz 1/3, B faz 1/4. Qual fração C deve fazer?', options: ['5/12', '1/6', '1/3', '7/12'], correct: 0, weight: 2 },
  { area: 'Raciocínio Lógico', text: 'Maria chegou imediatamente antes de Paulo e depois de Ana. Quem ficou em 2º?', options: ['Maria', 'Paulo', 'Ana', 'Impossível saber'], correct: 0, weight: 2 },
  { area: 'Raciocínio Lógico', text: 'Se 5 máquinas fazem 5 produtos em 5 minutos, 100 máquinas fazem 100 produtos em quantos minutos?', options: ['100', '5', '20', '50'], correct: 1, weight: 3 },
  { area: 'Atenção', text: 'Na lista 3,7,2,8,4,9,1,6,5 — qual número do conjunto 1–9 está faltando?', options: ['Nenhum, todos presentes', '4', '7', '2'], correct: 0, weight: 2 },
  { area: 'Reconhecimento de Padrões', text: 'Se CARRO = 15, MOTO = 12, então BICICLETA = ?', options: ['27', '21', '18', '24'], correct: 1, weight: 3 },
];

/* ---------- STATE ---------- */
let current  = 0;
let answers  = [];
let iqResult = {};

/* ---------- DOM ---------- */
const stepQuiz    = document.getElementById('step-quiz');
const stepCadastro= document.getElementById('step-cadastro');
const stepResult  = document.getElementById('step-result');
const progressFill= document.getElementById('progressFill');
const progressLabel=document.getElementById('progressLabel');
const areaTag     = document.getElementById('areaTag');
const questionText= document.getElementById('questionText');
const optionsCont = document.getElementById('optionsContainer');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');

/* ---------- HELPERS ---------- */
function showStep(step) {
  [stepQuiz, stepCadastro, stepResult].forEach(s => s.classList.remove('active'));
  step.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- RENDER QUESTION ---------- */
function renderQuestion() {
  const q     = QUESTIONS[current];
  const total = QUESTIONS.length;
  const pct   = ((current + 1) / total) * 100;

  progressFill.style.width   = pct + '%';
  progressLabel.textContent  = `Questão ${current + 1} de ${total}`;
  areaTag.textContent        = q.area;
  questionText.textContent   = q.text;
  optionsCont.innerHTML      = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (answers[current] === i ? ' selected' : '');
    btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span> ${opt}`;
    btn.addEventListener('click', () => selectOption(i));
    optionsCont.appendChild(btn);
  });

  prevBtn.style.display = current > 0 ? 'inline-flex' : 'none';
  nextBtn.disabled      = answers[current] === undefined;
  nextBtn.textContent   = current === total - 1 ? 'Ver meu resultado →' : 'Próxima →';
}

function selectOption(index) {
  answers[current] = index;
  document.querySelectorAll('.option-btn').forEach((b, i) =>
    b.classList.toggle('selected', i === index)
  );
  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  if (current < QUESTIONS.length - 1) { current++; renderQuestion(); }
  else computeAndShowResult();
});
prevBtn.addEventListener('click', () => { if (current > 0) { current--; renderQuestion(); } });

/* ---------- SCORING ---------- */
function computeAndShowResult() {
  let raw = 0, maxRaw = 0;
  QUESTIONS.forEach((q, i) => {
    maxRaw += q.weight;
    if (answers[i] === q.correct) raw += q.weight;
  });

  const ratio     = raw / maxRaw;
  const iq        = Math.round(70 + ratio * 75);
  const percentil = Math.round(ratio * 96 + 2);

  iqResult = { iqLow: iq - 5, iqHigh: iq + 5, percentil };

  // Show result + cadastro form
  document.getElementById('resultRangeCadastro').textContent = `${iq - 5} – ${iq + 5}`;
  document.getElementById('resultPercCadastro').textContent  = `Você está acima de ${percentil}% das pessoas avaliadas`;
  showStep(stepCadastro);
}

/* ---------- CADASTRO + ENVIO ---------- */
document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome  = document.getElementById('cNome').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const btn   = document.getElementById('cadastroBtn');

  if (!nome || !email) return;

  btn.disabled    = true;
  btn.textContent = 'Salvando...';

  const payload = {
    nome,
    email,
    iq_low:    iqResult.iqLow,
    iq_high:   iqResult.iqHigh,
    percentil: iqResult.percentil
  };

  // Salvar localmente para a página de obrigado
  sessionStorage.setItem('nm_nome',     nome);
  sessionStorage.setItem('nm_email',    email);
  sessionStorage.setItem('nm_iq_low',   iqResult.iqLow);
  sessionStorage.setItem('nm_iq_high',  iqResult.iqHigh);
  sessionStorage.setItem('nm_percentil',iqResult.percentil);

  try {
    // Dispara evento Lead no Meta Pixel
  if (typeof fbq !== 'undefined') { fbq('track', 'Lead', { content_name: 'Avaliacao NeuraMind', value: 19.90, currency: 'BRL' }); }

  // Envia para Google Apps Script (no-cors para evitar bloqueio CORS)
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (_) {
    // Continua mesmo se falhar (dados já estão no sessionStorage)
  }

  // Redireciona para Kiwify com parâmetros UTM
  const kiwifyBase = 'https://pay.kiwify.com.br/0dmU36N';
  const params     = new URLSearchParams({ name: nome, email, checkout_name: nome });
  window.location.href = `${kiwifyBase}?${params.toString()}`;
});

/* ---------- START ---------- */
showStep(stepQuiz);
renderQuestion();
