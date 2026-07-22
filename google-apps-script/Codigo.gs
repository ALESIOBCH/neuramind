// =====================================================
// NeuraMind — Google Apps Script
// Cole este código em: script.google.com → Novo projeto
// Depois clique em Implantar → Novo Implantação → App da Web
// Executar como: Eu | Acesso: Qualquer pessoa
// =====================================================

const SPREADSHEET_ID = '1iXGYuckJwBJyIuVU--PHEsw39UpjeMHhQQMvMLSPyyQ';
const SHEET_NAME     = 'Página1';
const EMAIL_DESTINO  = 'tiktokal0991@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const nome       = data.nome       || '';
    const email      = data.email      || '';
    const iqLow      = data.iq_low     || '';
    const iqHigh     = data.iq_high    || '';
    const percentil  = data.percentil  || '';
    const dataHora   = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const certId     = 'NM-' + Date.now();

    // 1. Salvar na planilha
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Cabeçalho se planilha vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Nome', 'E-mail', 'QI Mínimo', 'QI Máximo', 'Percentil', 'Nº Certificado', 'Status']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4F6EF7').setFontColor('#ffffff');
    }

    sheet.appendRow([dataHora, nome, email, iqLow, iqHigh, percentil, certId, 'Aguardando pagamento']);

    // 2. Enviar email de notificação para você
    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      subject: `🧠 Novo lead NeuraMind — ${nome}`,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:12px">
          <h2 style="color:#4F6EF7;margin-top:0">Novo lead NeuraMind</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:140px">Nome</td><td style="font-weight:bold">${nome}</td></tr>
            <tr><td style="padding:8px 0;color:#666">E-mail</td><td style="font-weight:bold">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Faixa de QI</td><td style="font-weight:bold;color:#4F6EF7">${iqLow} – ${iqHigh}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Percentil</td><td style="font-weight:bold">${percentil}%</td></tr>
            <tr><td style="padding:8px 0;color:#666">Nº Certificado</td><td style="font-weight:bold">${certId}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Data/Hora</td><td>${dataHora}</td></tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:24px">Acesse a planilha para acompanhar todos os leads.</p>
        </div>
      `
    });

    // 3. Enviar email de boas-vindas para o cliente
    MailApp.sendEmail({
      to: email,
      subject: `${nome}, seu resultado NeuraMind está pronto 🧠`,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0F;padding:32px;border-radius:16px">
          <h1 style="color:#4F6EF7;font-size:24px;margin-top:0">NeuraMind</h1>
          <p style="color:#E8EAF6;font-size:16px">Olá, <strong>${nome}</strong>!</p>
          <p style="color:#8B8FA8">Sua avaliação cognitiva foi concluída. Sua faixa de QI estimada é:</p>
          <div style="background:#12121A;border:1px solid #1E1E2E;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
            <div style="color:#4F6EF7;font-size:48px;font-weight:bold">${iqLow} – ${iqHigh}</div>
            <div style="color:#8B8FA8;margin-top:8px">Percentil estimado: <strong style="color:#E8EAF6">${percentil}%</strong></div>
          </div>
          <p style="color:#8B8FA8">Para acessar seu <strong style="color:#E8EAF6">relatório completo e certificado oficial</strong>, finalize o pagamento clicando no botão abaixo.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="https://pay.kiwify.com.br/SEU-LINK-AQUI" style="background:#4F6EF7;color:#fff;text-decoration:none;padding:16px 32px;border-radius:10px;font-weight:bold;font-size:16px">
              Acessar meu resultado completo →
            </a>
          </div>
          <p style="color:#8B8FA8;font-size:13px">Seu número de certificado: <strong style="color:#E8EAF6">${certId}</strong></p>
          <p style="color:#555;font-size:12px;margin-top:32px">NeuraMind • contato@neuramind.com.br</p>
        </div>
      `
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, cert_id: certId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Teste via GET (para verificar se o script está funcionando)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'NeuraMind Apps Script OK' }))
    .setMimeType(ContentService.MimeType.JSON);
}
