# NeuraMind — Landing Page

## Estrutura de pastas

```
neuramind/
├── index.html          ← Landing page principal
├── teste.html          ← Página do teste de QI
├── netlify.toml        ← Configuração do Netlify
├── README.md
├── css/
│   ├── style.css       ← Estilos globais
│   └── teste.css       ← Estilos específicos do quiz
├── js/
│   ├── main.js         ← Scripts da landing page
│   └── quiz.js         ← Lógica do quiz + pontuação
└── assets/
    └── favicon.svg
```

## Como publicar no Netlify

### Opção 1 — Drag & Drop (mais fácil)
1. Acesse https://app.netlify.com
2. Arraste a pasta `neuramind/` inteira para a área de deploy
3. Pronto! O site estará no ar em segundos.

### Opção 2 — GitHub + Deploy automático
1. Suba a pasta para um repositório no GitHub
2. Conecte o repositório no Netlify (New site → Import from Git)
3. Build command: deixe em branco
4. Publish directory: `.`
5. Clique em Deploy

## Configurar o link de pagamento

Em `js/quiz.js`, localize a linha:
```js
window.location.href = 'https://pay.kiwify.com.br/SEU-LINK-AQUI';
```
Substitua pelo seu link de checkout da Kiwify.

## Próximas páginas a criar
- `privacidade.html` — Política de Privacidade
- `termos.html` — Termos de Uso
- `obrigado.html` — Página pós-pagamento (prévia do resultado)
