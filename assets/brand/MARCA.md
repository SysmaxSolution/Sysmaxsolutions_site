# Marca Sysmax Software
Criada em 04/10/2026 por um time de design (1 lider + 2 criticos independentes: marca/credibilidade e oficio de icone).
## Direcao escolhida
**DIREÇÃO 2 — MONOGRAMA "S" (construído em grade, juntas em bevel, terminais cortados paralelos à diagonal)**
ADOTADA: D2 — MONOGRAMA "S", reconstruída. Os dois críticos convergiram na mesma direção (7,5 nos dois placares), então não houve empate a desempatar: houve uma fusão de camadas. Peguei a TESE do crítico de marca (monograma porque a Sysmax não tem equity para marca muda; a letra carrega o nome da empresa; neutra de setor — serve SYSVETMAX, HealthMax e odonto; uso padrão é lockup, símbolo solto só em favicon/avatar) e a CONSTRUÇÃO do crítico de ofício (escala, mask→path, compensação óptica, dois builds, title, sem width/height).

O que mudou em relação à D2 original, item por item:
1. ESCALA corrigida. Eixos das barras em y=22 e y=78, haste 20 → arestas em 12/32/68/88 (inteiros). Tinta = 72,10 × 76,00, centro exato em (50,50). Padding 12% vertical / 14% horizontal, contra 18%/23,5% antes. A 16px a haste passa de 2,72px para 3,20px.
2. <mask> ELIMINADA. A arte agora é UM <path> fechado de 12 vértices com fill direto (~215 bytes de "d"). Resolve Android VectorDrawable, pinned-tab do Safari, conversores SVG→ICO, PDF de boleto/receituário e corte/bordado. O requisito 1 do briefing (SVG puro) agora está realmente cumprido.
3. RASGOS (kerfs) DOS TERMINAIS REMOVIDOS, como o crítico de marca exigiu — a 180px liam como dano, e entre 24 e 48px borravam em cinza. A ideia de "peça usinada" migrou para o contorno interno: dois alívios de fresa de 1,4u paralelos à diagonal, 5u para dentro de cada flanco (verificado por point-in-polygon: os 4 extremos e os 2 pontos médios estão dentro da tinta).
4. TERMINAIS CORTADOS EM ÂNGULO, não a 90°. As duas faces são paralelas à diagonal: dx/dy = 0,8572 contra 0,8571 da diagonal (49,40°). Isso converte "traço com ponta reta" em "peça cortada" sem acrescentar um elemento que suma a 16px. A ponta aguda de 49,4° de cada terminal recebe quebra-de-canto de 3u (rebarba de peça fresada) — 15,4px a 512px, 0,48px a 16px: aparece de perto, desaparece limpo de longe.
5. COMPENSAÇÃO ÓPTICA DE PESO aplicada: barras horizontais com 20,0 e diagonal com 20,8 de largura PERPENDICULAR (+4%), conferido em 10,404 de meia-largura nos dois flancos. Sem isso a diagonal lê mais leve e o S engorda no meio, flertando com "5"/"2" a 24–32px.
6. NOME CORRIGIDO: é monograma "S". Não existe x na arte e não se apresenta ao diretor uma letra que não está desenhada.
7. BUILD EM TILE criado (svgFavicon): mesma geometria escalada 0,78 sobre tile #0F172A r=22, tinta #F0FDFA, padding óptico 20%. Raio máximo da tinta = 35,06 a partir do centro, logo sobrevive ao crop circular do WhatsApp (r=50) sem decepar terminal. Para Android adaptive icon (zona segura r=33) use a mesma arte a 0,73.
8. <title> como primeiro filho e width/height removidos do root (travavam o escalonamento por CSS quando inline). vector-effect NÃO usado em nenhuma variante.

Não adotei duas recomendações, e digo por quê: (a) o <style> com prefers-color-scheme dentro do arquivo — ele é tecnicamente correto, mas entrego svgPrincipal e svgEscuro como arquivos determinísticos, porque um favicon que muda de cor sozinho é indefensável em auditoria de marca e quebra o preview de link; quem quiser o comportamento automático troca o fill por currentColor e usa o svgMono com CSS da página (está nas regras). (b) Não escalei para 0,73 no arquivo principal do favicon: 2,50px de haste a 16px é melhor que 2,34px, e o Android adaptive é um caso derivado, não o caso principal.

RESSALVAS QUE PRECISAM IR AO DIRETOR JUNTO COM O ARQUIVO (os dois críticos insistiram, e eles estão certos):
- ANTERIORIDADE ANTES DE IMPRIMIR. Monograma S é a categoria de maior colisão que existe. Rodar INPI classes 9 e 42 + busca reversa de imagem antes de qualquer material impresso ou app publicado. Custo de pular: rebrand forçado depois.
- MARCA DA EMPRESA ≠ MARCA DO PRODUTO. Este S é da Sysmax Software (holding). NÃO sobrescrever C:\Sysmaxsolutions_site\assets\brand\sysvetmax-mark.svg sem decisão explícita dele. Alvos legítimos: favicon.svg, site.webmanifest, index.html (cabeçalho e rodapé).
- O ÍCONE É ~20% DO PROBLEMA. "Não passa credibilidade alguma" só fecha com: CNPJ + razão social + endereço no rodapé, página de Segurança/LGPD, "quem somos" com pessoas reais, e 2 clientes nomeados com depoimento (Almavet, Animais). Se trocarmos só o SVG, ele volta com a mesma frase em um mês.
- VALIDAR NOS TRÊS CONTEXTOS REAIS antes de fechar: aba do navegador ao lado de VetSmart/SimplesVet/Vetus, foto de perfil do WhatsApp comercial (crop circular) e cabeçalho de boleto/receituário em preto 100%.
## Por que passa credibilidade
Esta marca passa credibilidade porque ela diz o NOME DA EMPRESA: é o S de Sysmax construído em grade, não um símbolo abstrato que exige fama prévia para ser entendido — e quem está pesquisando se a Sysmax existe de verdade precisa ler o nome, não decifrar um enigma. Ela é verificavelmente construída, não desenhada a olho: simetria rotacional de 180° exata, um único path fechado sem auto-interseção, barras de 20 unidades contra diagonal de 20,8 perpendicular para compensar o peso óptico, terminais cortados no mesmo plano de 49,40° da diagonal com quebra-de-canto de 3 unidades — é o vocabulário de uma peça usinada, que é exatamente o que uma empresa de engenharia de software deveria assinar. Ela resiste aos quatro testes que realmente decidem: a 16px continua sendo uma letra e não uma mancha (haste de 3,2px, contraformas de 41 unidades), funciona em preto 100% no carimbo e no cabeçalho de receituário, não muda de identidade entre o fundo claro e o rodapé escuro, e não tem leitura acidental dominante — nem pata, nem coração, nem cruz, nem eletrocardiograma. E ela é neutra de setor por construção: serve o SYSVETMAX hoje, o HealthMax amanhã e a odontologia depois, sem readaptação — enquanto o ícone antigo, com a linha de ECG, prendia a empresa ao nicho saúde e repetia o clichê mais batido do mercado, que é justamente o motivo de ele não passar credibilidade nenhuma.
## Arquivos
| arquivo | uso |
|---|---|
| `favicon.svg` | tile (fundo slate-900 + S claro) — aba, atalho de celular, avatar |
| `assets/brand/sysmax-mark.svg` | glifo teal sem alivios — cabecalho do site (16-48px) |
| `assets/brand/sysmax-mark-dark.svg` | glifo claro — rodape e fundos escuros |
| `assets/brand/sysmax-mark-mono.svg` | `currentColor`, 1 path fechado — carimbo, boleto, receituario, gravacao |
| `assets/brand/sysmax-mark-detalhada.svg` | com os dois alivios de 1,4u — so a partir de 96px |
| `assets/brand/sysmax-mark-detalhada-dark.svg` | idem, para fundo escuro |
| `icon-512.png` `icon-192.png` `apple-touch-icon.png` `favicon.ico` | rasterizados do tile |

## Lockup
LOCKUP HORIZONTAL — uso padrão da marca. O símbolo solto NUNCA aparece no hero do site; só em favicon, app icon e avatar.

UNIDADE DE MEDIDA: C = altura de caixa-alta (cap height) do texto. Em Hanken Grotesk, cap height = 0,72 em, então font-size = C / 0,72 = 1,389 C (conferir na versão do arquivo da fonte antes de fechar).

1) TAMANHO DO SÍMBOLO
- Caixa do símbolo (o viewBox 0 0 100 100) = S = 2,105 C.
- Daí a tinta do glifo tem 0,76 S = 1,600 C de altura — exatamente a razão pedida (glifo = 1,6 × cap height) — e 0,721 S = 1,518 C de largura.
- Exemplo verificável a font-size 32px: C = 23,0px → S = 48px → tinta do símbolo = 36,5px de altura × 34,6px de largura.

2) ESPAÇO ENTRE SÍMBOLO E TEXTO
- Gap = 0,50 × largura da tinta do glifo = 0,759 C (arredondar para 0,76 C).
- Medido de TINTA A TINTA: da aresta direita da tinta do símbolo (x = 86,05 no viewBox) até a aresta esquerda da tinta do "S" de Sysmax — ignorar o sidebearing da fonte e as margens vazias do viewBox, senão o gap infla ~14%.
- Exemplo a font-size 32px (C = 23,0px): gap = 17,5px → usar 17px.

3) ALINHAMENTO VERTICAL (é matemático, não ajustado à mão)
- O S tem simetria rotacional de 180° exata em torno de (50,50) — conferido por script: os 12 vértices se mapeiam em pares que somam 100 em x e em y. Logo o centro óptico = centro geométrico.
- Regra: centrar a caixa de tinta do símbolo (altura 1,600 C) na linha média da faixa de caixa-alta, isto é em y = baseline − C/2. Zero nudge manual, zero "ajuste a olho".
- Exemplo a font-size 32px: baseline do texto a 42,25px do topo da tinta do símbolo.

4) TIPOGRAFIA DO NOME
- "Sysmax" — Hanken Grotesk 600, tracking −0,01 em, cor #0F172A (fundo escuro: #F8FAFC).
- "Software" — Hanken Grotesk 400, MESMO font-size, tracking 0, cor #475569 (fundo escuro: #94A3B8).
- Espaço entre as duas palavras = 0,30 C (não usar o espaço padrão da fonte, que é ~0,26 em e fica largo demais nesse peso).
- Nunca caixa-alta total, nunca itálico, nunca outra família.
- Variante compacta para espaços apertados (favicon bar, assinatura de e-mail, rodapé de documento): símbolo + "sysmax" sozinho, 600, caixa-baixa, mesmos números de gap e alinhamento.

5) ALTURA TOTAL E CLEARSPACE
- A altura do lockup é governada pelo símbolo: 1,600 C (a tinta) — o texto, com ascendentes e descendentes, cabe dentro disso.
- Área de proteção = 0,40 S em todos os quatro lados (equivale a uma contraforma do S: a boca do contra-vão mede ~41 unidades do viewBox). A font-size 32px → 19px de respiro livre em volta.

6) VERSÃO MONOCROMÁTICA DO LOCKUP
- Símbolo em currentColor (svgMono), "Sysmax" em currentColor 100%, "Software" em currentColor a 65% de opacidade. Em preto 100% para carimbo/boleto/receituário: tudo chapado, "Software" a 65% vira cinza de impressão — se a saída for 1-bit (carimbo de borracha), usar "Sysmax Software" inteiro em 100% e peso 600 nas duas palavras.

7) MÍNIMOS DO LOCKUP
- Mínimo: C = 11px (font-size 15px, caixa do símbolo 23px, largura total ≈ 96px). Abaixo disso o lockup se quebra: usar o tile (svgFavicon).

8) HTML/CSS DE REFERÊNCIA (proporções já embutidas)
.lockup{display:inline-flex;align-items:center;gap:0.76em;font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:23px /* = C */;line-height:1}
.lockup svg{height:1.6em;width:auto;display:block;flex:none;margin-right:-0.1em /* compensa a margem vazia do viewBox à direita: 13,95/76 = 0,18em; ajustar ao gap de tinta */}
.lockup b{font-weight:600;letter-spacing:-0.01em;font-size:1.389em;color:#0F172A}
.lockup span{font-weight:400;font-size:1.389em;color:#475569;margin-left:0.30em}
Observação: como o viewBox tem 13,95 unidades de vazio à esquerda e 13,95 à direita da tinta, o gap CSS precisa ser corrigido pela margem negativa acima (ou use um SVG recortado no bbox da tinta para o lockup). O gap FINAL é sempre medido de tinta a tinta: 0,76 C.

## Regras de uso
- TAMANHO MÍNIMO — símbolo solto (sem tile): 20px. Abaixo disso a haste cai de 4,0px e o monograma começa a fechar as contraformas. Tile (svgFavicon): 16px, onde a haste rende 2,50px. Lockup: cap height mínima de 11px (font-size 15px, largura total ~96px).
- DOIS BUILDS, NÃO UM. Use svgPrincipal/svgEscuro (com os dois alívios de 1,4u) somente a partir de 96px. De 16 a 48px use o svgFavicon ou o svgMono sem alívio: 1,4u rende 0,22px a 16px e 0,67px a 48px — nessa faixa o alívio não some limpo, ele borra em cinza. Isso é prática normal de marca (Apple, IBM), não remendo.
- ÁREA DE PROTEÇÃO = 0,40 × a altura da caixa do símbolo, nos quatro lados (equivale a uma contraforma do S). Nada entra aí: nem texto, nem ícone de rede social, nem borda de card, nem o selo de 'cliente desde'.
- FUNDO ESCURO (#0F172A): use svgEscuro (tinta #F0FDFA, alívio #2DD4BF). NÃO use o teal #0D9488 em cima do slate-900: ele passa em contraste (~4,8:1) mas tem presença fraca, e no rodapé a marca precisa pesar. Em fundo claro (#FFFFFF, #F8FAFC, #F0FDFA) use svgPrincipal.
- FAVICON / ATALHO DE CELULAR / AVATAR DE WHATSAPP: sempre o tile (svgFavicon), nunca o glifo vazado. O glifo sem contêiner perde presença na aba ao lado de concorrentes com tile cheio. O tile já foi testado para crop circular: raio máximo da tinta = 35,06 do centro, dentro do círculo inscrito (r=50), nenhum terminal é decepado.
- ANDROID ADAPTIVE ICON: a zona segura é r=33 do centro e a tinta do tile está em 35,06. Gere uma variante dedicada escalando a arte do glifo por 0,73 em torno de (50,50) — haste 14,6u, 2,34px a 16px, ainda legível. Não tente resolver com o arquivo padrão.
- CARIMBO, BOLETO, RECEITUÁRIO, FAX, BORDADO, GRAVAÇÃO A LASER: use svgMono. Ele é 1 path fechado, sem mask, sem gradiente, sem opacidade — é o único arquivo que atravessa conversor de PDF, SVG→ICO e máquina de corte sem perder nada. Defina a cor pelo CSS/atributo color do contexto, ou substitua currentColor por #000000 na hora de gerar o arquivo de produção.
- NUNCA use currentColor em favicon nem dentro de <img>: ali o SVG é documento próprio e currentColor cai no color do elemento raiz, que não existe. Para esses dois casos use svgPrincipal/svgEscuro/svgFavicon, que têm cor literal.
- NUNCA acrescente vector-effect="non-scaling-stroke" a nenhuma variante. Ele fixa a espessura em unidades de dispositivo e destruiria a marca a 512px (a haste de 20 ficaria com a mesma grossura em px de 16px e de 512px).
- NUNCA recoloque width/height no root dos SVGs. Eles travam o escalonamento por CSS quando o SVG é inline. O viewBox é o que define a proporção, e ele é 1:1 — o símbolo é sempre quadrado em caixa, mesmo com tinta de 72,10 × 76,00.
- NUNCA redesenhe, reconstrua ou 'melhore' o path. Toda credibilidade desta marca está em três fatos verificáveis por script: simetria rotacional de 180° exata (os 12 vértices somam 100 aos pares), polígono simples sem auto-interseção, e barras de 20,0 contra diagonal de 20,8 perpendicular (+4% de compensação óptica). Qualquer reconstrução a olho quebra os três.
- NUNCA aplique sombra, brilho, bisel, gradiente decorativo, contorno, rotação, espelhamento, deformação de proporção, nem outline em volta do glifo. Nunca mude as cores: só #0D9488 (claro), #F0FDFA (escuro) e currentColor (mono) são aprovados.
- NUNCA coloque o símbolo solto no hero do site, em cartão de visita ou em slide de abertura. O uso padrão é o LOCKUP (símbolo + 'Sysmax Software'). A empresa não tem reconhecimento para usar marca muda — símbolo sozinho só em favicon, app icon e avatar, onde o nome aparece ao lado por conta da plataforma.
- NUNCA use esta marca como marca do produto. Este S é da Sysmax Software (holding). SYSVETMAX, HealthMax e o futuro módulo de odontologia têm marcas próprias e não devem ser substituídos por este arquivo. Não sobrescrever assets/brand/sysvetmax-mark.svg.
- NUNCA imprima nem publique em app store antes da busca de anterioridade: INPI classes 9 e 42 + busca reversa de imagem. Monograma S é a categoria de maior colisão de marca que existe.
- PACOTE DE ENTREGA obrigatório para não degradar em três semanas nas mãos de quem monta slide e post: PNG 16/32/48/180/192/512 do tile, SVG otimizado das 4 variantes, lockup em SVG claro/escuro/mono, e uma página de uso de 1 tela com estes números. Sem isso, o ativo apodrece.
