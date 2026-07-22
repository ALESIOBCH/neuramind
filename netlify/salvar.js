exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhvm2CfTxVLYFwFGbCS74LGPTjVBmWB6zKhA6Bhr75sIkVnNaaYJe1cgC1wZCTl707/exec';

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
      redirect: 'follow'
    });

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true, response: text })
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
