/* =========================================
   NeuraMind — obrigado.js
   ========================================= */

// Recupera dados da sessão
const nome     = sessionStorage.getItem('nm_nome')     || 'Parabéns';
const iqLow    = parseInt(sessionStorage.getItem('nm_iq_low')  || 100);
const iqHigh   = parseInt(sessionStorage.getItem('nm_iq_high') || 110);
const percentil= parseInt(sessionStorage.getItem('nm_percentil')|| 60);

// Preenche nome
document.getElementById('nomeCliente').textContent = nome.split(' ')[0];
document.getElementById('certNome').textContent    = nome;

// Preenche QI
document.getElementById('iqDisplay').innerHTML  = `${iqLow}<span style="color:var(--blue)">–</span>${iqHigh}`;
document.getElementById('certIq').textContent   = `QI: ${iqLow} – ${iqHigh}`;
document.getElementById('percentilDisplay').textContent = `Você está acima de ${percentil}% das pessoas avaliadas`;

// Gera barras pseudo-aleatórias baseadas no QI
const ratio = (iqHigh - 70) / 75;
const bars  = [
  { id: 'bf1', label: 'b1', base: 0.85 },
  { id: 'bf2', label: 'b2', base: 0.70 },
  { id: 'bf3', label: 'b3', base: 0.80 },
  { id: 'bf4', label: 'b4', base: 0.90 },
  { id: 'bf5', label: 'b5', base: 0.75 },
];

bars.forEach(b => {
  const val = Math.min(99, Math.round((ratio * b.base + (1 - b.base) * 0.5) * 100));
  document.getElementById(b.id).dataset.width = val + '%';
  document.getElementById(b.label).textContent = val + '/100';
});

// Anima barras quando visíveis
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.pbar__fill').forEach(f => {
        f.style.width = f.dataset.width;
      });
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const barsEl = document.getElementById('barsDisplay');
if (barsEl) obs.observe(barsEl);

// Skip button
document.getElementById('skipBtn').addEventListener('click', () => {
  document.querySelector('.obg-telegram').style.display = 'none';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});
