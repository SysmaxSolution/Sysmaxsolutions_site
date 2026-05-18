# SysVetMax — Landing Page Freemium v3 (APROVADA)

Arquivo único: `index.html` (Tailwind via CDN, sem build).

## Deploy em 4 passos (~60 segundos)

```bash
# 1. Clone (se ainda não tem local)
git clone https://github.com/SysmaxSolution/Sysmaxsolutions_site.git
cd Sysmaxsolutions_site

# 2. Substitua a landing antiga pela nova
cp /caminho/para/index.html ./index.html
#   (ou abra o repo no editor e cole o conteúdo manualmente)

# 3. Commit + push
git add index.html
git commit -m "feat(landing): deploy v3 Freemium PLG com blindagem jurídica e separação Free/Premium"
git push origin main
```

**4. Deploy Vercel** — se o repo já está conectado à Vercel, o push dispara o build sozinho. Caso não esteja:

- Acesse https://vercel.com/new
- Importe o repo `SysmaxSolution/Sysmaxsolutions_site`
- Framework preset: **Other** (HTML estático)
- Root directory: raiz (`./`)
- Domínio: aponte `sysmaxsolutions.com` no painel Vercel → Domains

## Checklist pós-deploy

Abra `https://sysmaxsolutions.com` e verifique:

- [ ] Hero carrega com headline "Sua clínica funcionando sem mensalidade…"
- [ ] Botão "ACESSE AGORA — É GRÁTIS" no header redireciona para `sysvetmax.sysmaxsolutions.com`
- [ ] WhatsApp flutuante (canto inferior direito) abre conversa com `(16) 99702-3340`
- [ ] Tour de telas alterna automaticamente (5 seções)
- [ ] FAQ expande e retrai sem erro
- [ ] Mobile (DevTools < 640px): nav esconde, CTAs continuam acessíveis

## Notas de manutenção

- **Vídeo demo:** quando estiver pronto, substituir o placeholder em `#demo-video` (linha ~111). O bloco já tem `aspect-[4/3]` e browser chrome — é só trocar o `<button>` central por `<video controls poster="...">`.
- **Screenshots do tour:** estão em `assets/screens/` (kanban, prontuario, mentor, exames, financeiro). Substituir pelos prints reais quando disponíveis preserva todo o layout.
- **Tracking:** o head não tem GA/Pixel ainda. Quando subir, adicionar antes do `</head>` o snippet do GTM ou GA4.

---

**Aprovação registrada:** v3 Freemium · Nota 10 (arquitetura + comercial) · 17 mai 2026
