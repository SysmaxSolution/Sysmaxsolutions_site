# -*- coding: utf-8 -*-
"""
Gera as paginas de modulo (/modulos/...) e de perfil (/para/...) a partir de
conteudo/paginas.json, reaproveitando o cabecalho e o rodape da home — assim
uma mudanca no index.html se propaga para as 15 paginas numa regeracao.

Uso:  python tools/gerar-paginas.py
"""
import io, json, os, re, html

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://sysmaxsolutions.com'
APP = 'https://sysvetmax.sysmaxsolutions.com'


def fatia(texto, inicio, fim):
    a = texto.find(inicio)
    b = texto.find(fim, a)
    if a < 0 or b < 0:
        raise SystemExit('nao achei o trecho %r no index.html' % inicio)
    return texto[a:b + len(fim)]


def esc(s):
    return html.escape(str(s or ''), quote=True)


def carregar_moldura():
    idx = io.open(os.path.join(RAIZ, 'index.html'), encoding='utf-8').read()
    cab = fatia(idx, '<header class="site-header">', '</header>')
    rod = fatia(idx, '<footer class="site-footer">', '</footer>')
    # na home os links de secao sao ancoras; fora dela precisam apontar para a home
    for ancora in ['#caminho', '#produto', '#preco', '#dados', '#duvidas', '#rotina', '#demonstracao']:
        cab = cab.replace('href="%s"' % ancora, 'href="/%s"' % ancora)
        rod = rod.replace('href="%s"' % ancora, 'href="/%s"' % ancora)
    return cab, rod


def bloco_passos(passos):
    # numeracao se justifica: e uma sequencia real do atendimento
    linhas = ['<ol class="passos">']
    for p in passos:
        linhas.append('<li><h3 class="h3">%s</h3><p class="small">%s</p></li>'
                      % (esc(p['titulo']), esc(p['texto'])))
    linhas.append('</ol>')
    return '\n'.join(linhas)


def bloco_lista(itens):
    check = ('<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">'
             '<path d="M8 13.2 4.8 10l-1.3 1.3L8 15.8l8.5-8.5-1.3-1.3z"/></svg>')
    linhas = ['<ul class="list">']
    for i in itens:
        linhas.append('<li>%s %s</li>' % (check, esc(i)))
    linhas.append('</ul>')
    return '\n'.join(linhas)


def bloco_faq(faq):
    linhas = ['<div class="faq">']
    for f in faq:
        linhas.append('<details><summary>%s</summary><div class="answer">%s</div></details>'
                      % (esc(f['pergunta']), esc(f['resposta'])))
    linhas.append('</div>')
    return '\n'.join(linhas)


def jsonld(pg, url, secao, rotulo_secao):
    migalha = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Início", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": rotulo_secao, "item": SITE + "/" + secao},
            {"@type": "ListItem", "position": 3, "name": pg['h1'], "item": url},
        ],
    }
    blocos = ['<script type="application/ld+json">%s</script>'
              % json.dumps(migalha, ensure_ascii=False)]
    if pg.get('faq'):
        perg = {
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": f['pergunta'],
                 "acceptedAnswer": {"@type": "Answer", "text": f['resposta']}}
                for f in pg['faq']
            ],
        }
        blocos.append('<script type="application/ld+json">%s</script>'
                      % json.dumps(perg, ensure_ascii=False))
    return '\n'.join(blocos)


PAGINA = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo} — Sysmax Software</title>
<meta name="description" content="{meta}">
<link rel="canonical" href="{url}">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0F172A">

<meta property="og:type" content="article">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Sysmax Software">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{meta}">
<meta property="og:image" content="{site}/og-image.png">
<meta name="twitter:card" content="summary_large_image">

<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/hanken-grotesk-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/spline-sans-mono-latin.woff2" crossorigin>
<link rel="stylesheet" href="/styles/site.css?v=20261007">
</head>
<body>

<a class="skip" href="#conteudo">Ir para o conteúdo</a>

{cabecalho}

<main id="conteudo">

  <section class="wrap hero hero--interna">
    <nav class="migalha" aria-label="Você está em">
      <a href="/">Início</a> <span aria-hidden="true">/</span> <a href="/{secao}">{rotulo_secao}</a>
    </nav>
    <span class="badge">{eyebrow}</span>
    <h1 class="display">{h1}</h1>
    <p class="lede">{lede}</p>
    <div class="cta-row">
      <a class="btn btn--primary btn--lg" href="{app}" rel="noopener">Criar conta grátis</a>
      <a class="link" href="{wa}" target="_blank" rel="noopener" data-wa>Falar no WhatsApp</a>
    </div>
  </section>

  <section class="section section--sunken">
    <div class="wrap">
      <h2 class="h2 solo">Como costuma ser hoje</h2>
      <p class="body">{dor}</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2 class="h2 solo">Como funciona no SYSVETMAX</h2>
      {passos}
    </div>
  </section>

  <section class="section section--sunken">
    <div class="wrap">
      <div class="dupla">
        <div>
          <h2 class="h2">O que já está pronto</h2>
          {pronto}
        </div>
        <div class="card limites">
          <h3 class="h3">O que ainda não está</h3>
          <p class="small">{limites}</p>
          <p class="fine">Preferimos dizer antes. É o que você vai cobrar da gente depois.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2 class="h2 solo">Onde isso entra no preço</h2>
      <p class="body">{preco}</p>
      <p class="body" style="margin-top:12px">O preço é por módulo, não por pessoa logada: a recepção, o consultório e a internação podem estar abertos ao mesmo tempo sem que a conta mude. <a class="link" href="/#preco">Ver todos os módulos</a>.</p>
    </div>
  </section>

  <section class="section section--sunken">
    <div class="wrap">
      <h2 class="h2 solo">Perguntas frequentes</h2>
      {faq}
    </div>
  </section>

  <section class="section section--ink section--close">
    <div class="wrap">
      <div class="close__in">
        <h2 class="h2">Crie a conta e abra o sistema hoje</h2>
        <p class="lede">{cta}</p>
        <div class="cta-row">
          <a class="btn btn--onink btn--lg" href="{app}" rel="noopener">Criar conta grátis</a>
          <a class="link link--onink" href="{wa}" target="_blank" rel="noopener" data-wa>Falar no WhatsApp</a>
        </div>
      </div>
    </div>
  </section>

</main>

{rodape}

{jsonld}

<script defer src="/_vercel/insights/script.js"></script>
<script src="/scripts/site.js?v=20261007" defer></script>
</body>
</html>
"""

HUB = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo} — Sysmax Software</title>
<meta name="description" content="{meta}">
<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0F172A">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{meta}">
<meta property="og:image" content="{site}/og-image.png">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/hanken-grotesk-latin.woff2" crossorigin>
<link rel="stylesheet" href="/styles/site.css?v=20261007">
</head>
<body>
<a class="skip" href="#conteudo">Ir para o conteúdo</a>
{cabecalho}
<main id="conteudo">
  <section class="wrap hero hero--interna">
    <nav class="migalha" aria-label="Você está em"><a href="/">Início</a> <span aria-hidden="true">/</span> {rotulo}</nav>
    <h1 class="display">{h1}</h1>
    <p class="lede">{lede}</p>
  </section>
  <section class="section section--sunken">
    <div class="wrap">
      <div class="indice">{itens}</div>
    </div>
  </section>
</main>
{rodape}
<script defer src="/_vercel/insights/script.js"></script>
<script src="/scripts/site.js?v=20261007" defer></script>
</body>
</html>
"""

WA = ('https://wa.me/5511937083389?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20'
      'queria%20saber%20mais%20sobre%20o%20SYSVETMAX.')


def main():
    cab, rod = carregar_moldura()
    dados = json.load(io.open(os.path.join(RAIZ, 'conteudo', 'paginas.json'), encoding='utf-8'))

    gerados = []
    for pg in dados:
        secao = 'modulos' if pg['tipo'] == 'modulo' else 'para'
        rotulo = 'Módulos' if secao == 'modulos' else 'Para quem'
        eyebrow = 'Módulo do SYSVETMAX' if secao == 'modulos' else 'Serve para a sua clínica?'
        url = '%s/%s/%s' % (SITE, secao, pg['slug'])
        corpo = PAGINA.format(
            titulo=esc(pg['tituloPagina']), meta=esc(pg['metaDescricao']), url=url, site=SITE,
            cabecalho=cab, rodape=rod, app=APP, wa=WA, secao=secao,
            rotulo_secao=rotulo, eyebrow=esc(eyebrow),
            h1=esc(pg['h1']), lede=esc(pg['lede']), dor=esc(pg['dor']),
            passos=bloco_passos(pg['comoFunciona']),
            pronto=bloco_lista(pg['oQueEstaPronto']),
            limites=esc(pg['limites']), preco=esc(pg['preco']),
            faq=bloco_faq(pg['faq']), cta=esc(pg['ctaTexto']),
            jsonld=jsonld(pg, url, secao, rotulo),
        )
        destino = os.path.join(RAIZ, secao, pg['slug'] + '.html')
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        io.open(destino, 'w', encoding='utf-8').write(corpo)
        gerados.append((secao, pg['slug'], pg['h1'], pg['lede']))

    # paginas-indice
    for secao, rotulo, h1, lede, meta in [
        ('modulos', 'Módulos', 'Os módulos do SYSVETMAX',
         'Você liga só as partes que a sua clínica usa. Cada módulo tem uma página explicando o que faz, o que já está pronto e o que ainda não está.',
         'Conheça os módulos do SYSVETMAX um a um: prontuário, agenda, caixa, estoque, compras, controlados, conferência de cartão, nota fiscal, exames e internação.'),
        ('para', 'Para quem', 'O SYSVETMAX serve para a sua clínica?',
         'A mesma ferramenta atende operações bem diferentes. Escolha o perfil mais parecido com o seu e veja o que muda na prática.',
         'Clínica pequena, clínica com pet shop, hospital 24h, centro de diagnóstico ou laboratório: veja o que o SYSVETMAX resolve em cada tipo de operação.'),
    ]:
        itens = []
        for s, slug, titulo, desc in gerados:
            if s != secao:
                continue
            itens.append(
                '<a class="indice__item" href="/%s/%s"><h3 class="h3">%s</h3>'
                '<p class="small">%s</p></a>' % (s, slug, esc(titulo), esc(desc))
            )
        corpo = HUB.format(
            titulo=esc(h1), meta=esc(meta), url='%s/%s' % (SITE, secao), site=SITE,
            cabecalho=cab, rodape=rod, rotulo=esc(rotulo),
            h1=esc(h1), lede=esc(lede), itens='\n'.join(itens),
        )
        io.open(os.path.join(RAIZ, secao, 'index.html'), 'w', encoding='utf-8').write(corpo)

    # sitemap
    urls = ['%s/' % SITE, '%s/modulos' % SITE, '%s/para' % SITE]
    urls += ['%s/%s/%s' % (SITE, s, slug) for s, slug, _, _ in gerados]
    linhas = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        prio = '1.0' if u.endswith('/') and u.count('/') == 3 else '0.7'
        linhas.append('  <url><loc>%s</loc><changefreq>monthly</changefreq><priority>%s</priority></url>' % (u, prio))
    linhas.append('</urlset>')
    io.open(os.path.join(RAIZ, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(linhas) + '\n')

    print('paginas geradas: %d' % len(gerados))
    for s, slug, _, _ in gerados:
        print('  /%s/%s' % (s, slug))
    print('indices: /modulos, /para')
    print('sitemap: %d URLs' % len(urls))


if __name__ == '__main__':
    main()
