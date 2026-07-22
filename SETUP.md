# NeuraMind — Guia de Configuração Completo

## PASSO 1 — Google Apps Script (banco de dados)

1. Acesse https://script.google.com
2. Clique em **Novo projeto**
3. Apague o código existente
4. Cole o conteúdo de `google-apps-script/Codigo.gs`
5. Clique em **Implantar → Nova implantação**
6. Tipo: **App da Web**
7. Executar como: **Eu**
8. Quem tem acesso: **Qualquer pessoa**
9. Clique em **Implantar** e copie a **URL do app da web**
10. Cole essa URL em `js/quiz.js` na linha:
    ```js
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec';
    ```

---

## PASSO 2 — Telegram Bot

1. Abra o Telegram e procure **@BotFather**
2. Digite `/newbot`
3. Nome do bot: `NeuraMind`
4. Username: `neuramind_iq_bot` (ou outro disponível)
5. Copie o **TOKEN** recebido
6. Substitua em `telegram-bot/bot.js`:
   ```js
   const TOKEN = 'SEU_TOKEN_AQUI';
   ```
7. No terminal:
   ```bash
   cd telegram-bot
   npm install
   node bot.js
   ```
8. Para manter o bot sempre rodando, use um servidor (Railway, Render, VPS)

### Link do bot para colocar no site:
`https://t.me/SEU_USERNAME_BOT`

Substitua em `obrigado.html` e `js/quiz.js` onde aparecer `t.me/neuramind_bot`.

---

## PASSO 3 — Kiwify

### Produto 1: Certificado (pagamento único)
1. Acesse https://kiwify.com.br
2. Crie uma conta
3. Novo produto → Infoproduto → Pagamento único
4. Nome: **Avaliação Cognitiva NeuraMind**
5. Preço: R$47
6. Página de obrigado: `https://SEU-DOMINIO.netlify.app/obrigado.html`
7. Copie o link de checkout e substitua em `js/quiz.js`:
   ```js
   const kiwifyBase = 'https://pay.kiwify.com.br/SEU-LINK-AQUI';
   ```

### Produto 2: Assinatura mensal
1. Novo produto → Assinatura
2. Nome: **Programa Cognitivo NeuraMind**
3. Preço: R$37/mês
4. Substitua em `obrigado.html`:
   ```html
   href="https://pay.kiwify.com.br/SEU-LINK-ASSINATURA"
   ```

---

## PASSO 4 — Netlify (publicar o site)

1. Acesse https://app.netlify.com
2. Arraste a pasta `neuramind/` (sem a pasta `telegram-bot/`)
3. Aguarde o deploy — leva menos de 1 minuto
4. Acesse o domínio gerado (ex: `amazing-iq-123.netlify.app`)
5. Opcional: conecte um domínio personalizado nas configurações

---

## PASSO 5 — Pixel do Meta Ads (para rastrear conversões)

Adicione antes do `</head>` em `index.html` e `teste.html`:
```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'SEU_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

Em `obrigado.html`, adicione após o pixel:
```js
fbq('track', 'Purchase', { value: 47.00, currency: 'BRL' });
```

---

## RESUMO DOS LINKS A SUBSTITUIR

| Arquivo | Buscar | Substituir por |
|---------|--------|----------------|
| `js/quiz.js` | `SEU_ID_AQUI` | URL do Apps Script |
| `js/quiz.js` | `SEU-LINK-AQUI` | Link Kiwify certificado |
| `obrigado.html` | `SEU-LINK-ASSINATURA` | Link Kiwify assinatura |
| `telegram-bot/bot.js` | `SEU_TOKEN_AQUI` | Token do BotFather |
| `google-apps-script/Codigo.gs` | `SEU-LINK-AQUI` | Link Kiwify certificado |
