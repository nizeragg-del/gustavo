
export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Código de autorização não encontrado.');
    }

    try {
        const response = await fetch('https://sandbox.melhorenvio.com.br/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
                client_secret: process.env.MELHOR_ENVIO_CLIENT_SECRET,
                redirect_uri: process.env.MELHOR_ENVIO_REDIRECT_URI,
                code: code,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json(data);
        }

        // Display the tokens to the user
        res.setHeader('Content-Type', 'text/html');
        res.send(`
      <h1>Sucesso!</h1>
      <p>Copie o token abaixo e adicione na variavel <strong>VITE_MELHOR_ENVIO_TOKEN</strong> na Vercel:</p>
      <textarea style="width: 100%; height: 150px;">${data.access_token}</textarea>
      <p><strong>Nota:</strong> Este token expira em 30 dias. Para uma solução definitiva, precisaremos implementar a renovação automática usando o Refresh Token abaixo:</p>
      <textarea style="width: 100%; height: 100px;">${data.refresh_token}</textarea>
    `);

    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).send('Erro ao trocar o código pelo token.');
    }
}
