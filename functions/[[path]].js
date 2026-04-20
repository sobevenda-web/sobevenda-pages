// functions/[[path]].js
// Esta função captura TODAS as URLs e busca o HTML no Xano

export async function onRequest(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const pathname = url.pathname;
    const slug = pathname.replace('/', '') || 'index';
    
    console.log(`[SobeVenda] Requisição: ${hostname}${pathname}`);
    
    // Busca no endpoint público do Xano
    const xanoUrl = `${env.XANO_API_URL}/public-page/${hostname}/${slug}`;
    
    const response = await fetch(xanoUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`[SobeVenda] Página não encontrada: ${hostname}/${slug}`);
      return new Response(getErrorPage(404, 'Página não encontrada'), { 
        status: 404,
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    const pageData = await response.json();
    
    // Retorna o HTML
    const htmlContent = pageData.html_content || pageData.html || pageData.content;
    
    if (!htmlContent) {
      console.error('[SobeVenda] HTML vazio na resposta do Xano');
      return new Response(getErrorPage(500, 'Conteúdo não encontrado'), {
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    console.log(`[SobeVenda] Página carregada com sucesso: ${slug}`);
    
    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'X-Powered-By': 'SobeVenda',
      },
    });

  } catch (error) {
    console.error('[SobeVenda] Erro:', error);
    
    return new Response(getErrorPage(500, 'Erro ao carregar página'), {
      status: 500,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

function getErrorPage(code, message) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro ${code} - SobeVenda</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
        }
        .error-container {
          text-align: center;
          padding: 60px 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          max-width: 500px;
        }
        h1 { 
          font-size: 96px; 
          margin-bottom: 20px;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        p { 
          font-size: 24px; 
          opacity: 0.95;
          line-height: 1.5;
        }
        .logo {
          margin-top: 40px;
          opacity: 0.7;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1>${code}</h1>
        <p>${message}</p>
        <div class="logo">Powered by SobeVenda</div>
      </div>
    </body>
    </html>
  `;
}
