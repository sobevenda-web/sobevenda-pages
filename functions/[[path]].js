// functions/[[path]].js
// Esta função captura TODAS as URLs e busca o HTML no Xano

export async function onRequest(context) {
  const { request, env } = context;
  
  try {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const pathname = url.pathname;
    const slug = pathname.replace('/', '') || 'index';
    
    // Permitir arquivos estáticos
    if (pathname === '/' || 
        pathname === '/index.html' || 
        pathname.endsWith('.html') || 
        pathname.endsWith('.css') || 
        pathname.endsWith('.js') || 
        pathname.endsWith('.png') || 
        pathname.endsWith('.jpg') || 
        pathname.endsWith('.ico') ||
        pathname.endsWith('.svg')) {
      return env.ASSETS.fetch(request);
    }
    
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
    
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
  } catch (error) {
    console.error('[SobeVenda] Erro:', error);
    return new Response(getErrorPage(500, 'Erro interno'), {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
}

function getErrorPage(code, message) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${code} - ${message}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
        }
        h1 { font-size: 4rem; margin: 0; color: #764ba2; }
        p { font-size: 1.2rem; color: #666; }
        small { color: #999; }
    </style>
</head>
<body>
    <div class="card">
        <h1>${code}</h1>
        <p>${message}</p>
        <p><small>Powered by SobeVenda</small></p>
    </div>
</body>
</html>`;
}
