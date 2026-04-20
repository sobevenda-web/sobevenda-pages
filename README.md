# SobeVenda Pages

Sistema de hospedagem de páginas do SobeVenda usando Cloudflare Pages.

## 🚀 Como funciona

1. Usuário acessa um domínio (ex: `www.cliente.com` ou `pages.sobevenda.com/slug`)
2. Cloudflare Pages intercepta a requisição
3. Busca o HTML no Xano via API pública
4. Retorna a página renderizada com SSL

## 📁 Estrutura

```
sobevenda-pages/
├── functions/
│   └── [[path]].js        # Função serverless (captura todas URLs)
├── public/
│   ├── index.html         # Página inicial
│   └── _headers           # Headers de segurança
├── wrangler.toml          # Configuração do Cloudflare
└── README.md
```

## ⚙️ Variáveis de Ambiente

Configure na dashboard do Cloudflare Pages:

- `XANO_API_URL` - URL da API do Xano (ex: `https://seu-xano.com/api:xxx`)

## 🔗 Endpoint do Xano

A função busca páginas neste endpoint:

```
GET /public-page/{domain}/{slug}

Resposta esperada:
{
  "html_content": "<html>...</html>"
}
```

## 📝 Deploy

Feito automaticamente via GitHub quando você faz push para a branch `main`.

## 🛠️ Tecnologias

- Cloudflare Pages
- Cloudflare Workers (Functions)
- Xano (Backend)
- GitHub (Versionamento)

---

Desenvolvido para o **SobeVenda** 💜
