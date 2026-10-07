/* Sysmax Software — comportamento do site. Sem dependências. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     WhatsApp comercial. Para trocar um número, altere só esta lista.
     O visitante é distribuído entre os números e fica fixo no mesmo
     atendente nas próximas visitas.
     --------------------------------------------------------------------- */
  var WHATSAPP = ['5511937083389', '5516997253250'];
  var SAUDACAO = 'Olá! Vim pelo site e queria saber mais sobre o SYSVETMAX.';

  function numeroDoVisitante() {
    var escolhido;
    try {
      escolhido = localStorage.getItem('sysmax:wa');
      if (WHATSAPP.indexOf(escolhido) === -1) escolhido = null;
    } catch (e) { escolhido = null; }

    if (!escolhido) {
      var i = 0;
      try {
        i = (parseInt(localStorage.getItem('sysmax:wa-i') || '0', 10) + 1) % WHATSAPP.length;
        localStorage.setItem('sysmax:wa-i', String(i));
      } catch (e) { i = Math.floor(Math.random() * WHATSAPP.length); }
      escolhido = WHATSAPP[i];
      try { localStorage.setItem('sysmax:wa', escolhido); } catch (e) {}
    }
    return escolhido;
  }

  /* ---------------------------------------------------------------------
     Origem do visitante. Só lê ?ref= / ?utm_* do endereço (um link que a
     equipe distribuiu) e guarda na aba, sem cookie, sem IP e sem impressão
     digital do navegador. Serve para dizer à equipe de onde veio quem
     chamou; quem apenas navega continua anônimo.
     --------------------------------------------------------------------- */
  function limparRef(v) {
    return String(v || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  }

  function origemDoVisitante() {
    var novo = '';
    try {
      var q = new URLSearchParams(window.location.search);
      novo = limparRef(q.get('ref'));
      if (!novo) {
        novo = limparRef(['utm_source', 'utm_medium', 'utm_campaign'].map(function (k) {
          return limparRef(q.get(k));
        }).filter(Boolean).join('-'));
      }
    } catch (e) { novo = ''; }

    try {
      if (novo) sessionStorage.setItem('sysmax:ref', novo);
      return novo || limparRef(sessionStorage.getItem('sysmax:ref'));
    } catch (e) { return novo; }
  }

  var REF = origemDoVisitante();
  if (REF) SAUDACAO += ' (ref: ' + REF + ')';

  var linkWhats = 'https://wa.me/' + numeroDoVisitante() + '?text=' + encodeURIComponent(SAUDACAO);
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    a.setAttribute('href', linkWhats);
    a.setAttribute('rel', 'noopener');
    a.setAttribute('target', '_blank');
  });

  /* --- menu no celular -------------------------------------------------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mobile');

  function fecharMenu(devolverFoco) {
    if (!burger || !menu) return;
    var estavaAberto = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    menu.setAttribute('data-open', 'false');
    // sem isso o foco fica preso num elemento que acabou de sumir
    if (devolverFoco && estavaAberto) burger.focus();
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var aberto = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!aberto));
      burger.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
      menu.setAttribute('data-open', String(!aberto));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') fecharMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharMenu(true);
    });
  }

  /* --- abas das telas do produto --------------------------------------- */
  var abas = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  function mostrarAba(aba) {
    abas.forEach(function (b) {
      var ativo = b === aba;
      b.setAttribute('aria-selected', String(ativo));
      b.setAttribute('tabindex', ativo ? '0' : '-1');
      var painel = document.getElementById(b.getAttribute('aria-controls'));
      if (painel) painel.setAttribute('data-active', String(ativo));
    });
  }

  abas.forEach(function (aba, i) {
    aba.addEventListener('click', function () { mostrarAba(aba); });
    aba.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowRight') destino = abas[(i + 1) % abas.length];
      if (e.key === 'ArrowLeft') destino = abas[(i - 1 + abas.length) % abas.length];
      if (e.key === 'Home') destino = abas[0];
      if (e.key === 'End') destino = abas[abas.length - 1];
      if (destino) { e.preventDefault(); destino.focus(); mostrarAba(destino); }
    });
  });

  /* --- ampliar a tela (dialog nativo: foco preso e Esc de graça) -------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  var abriuLightbox = null;

  if (lightbox && lightboxImg && typeof lightbox.showModal === 'function') {
    lightbox.addEventListener('close', function () {
      if (abriuLightbox) { abriuLightbox.focus(); abriuLightbox = null; }
    });
    document.addEventListener('click', function (e) {
      var botao = e.target.closest ? e.target.closest('.zoom') : null;
      if (botao) {
        var img = botao.querySelector('img');
        lightboxImg.setAttribute('src', botao.getAttribute('data-full'));
        lightboxImg.setAttribute('alt', img ? img.getAttribute('alt') : '');
        abriuLightbox = botao;
        lightbox.showModal();
        return;
      }
      if (e.target === lightbox) lightbox.close();
      if (e.target.classList && e.target.classList.contains('lightbox__close')) lightbox.close();
    });
  }

  /* --- calculadora de horas que voltam --------------------------------- */
  var campos = {
    atend: document.getElementById('c-atend'),
    cartao: document.getElementById('c-cartao'),
    nota: document.getElementById('c-nota'),
    avisos: document.getElementById('c-avisos')
  };
  var saidas = {
    atend: document.getElementById('o-atend'),
    cartao: document.getElementById('o-cartao'),
    nota: document.getElementById('o-nota'),
    avisos: document.getElementById('o-avisos')
  };
  var resultado = document.getElementById('r-horas');
  var detalhe = document.getElementById('r-detalhe');

  function calcular() {
    if (!campos.atend || !resultado) return;

    var atend = Number(campos.atend.value);
    var cartao = Number(campos.cartao.value);
    var nota = Number(campos.nota.value);
    var avisos = Number(campos.avisos.value);

    if (saidas.atend) saidas.atend.textContent = atend;
    if (saidas.cartao) saidas.cartao.textContent = cartao + ' h';
    if (saidas.nota) saidas.nota.textContent = nota;
    if (saidas.avisos) saidas.avisos.textContent = avisos;

    // pinta a parte percorrida de cada controle
    Object.keys(campos).forEach(function (k) {
      var el = campos[k];
      if (!el) return;
      var min = Number(el.min), max = Number(el.max);
      var pct = max > min ? ((Number(el.value) - min) / (max - min)) * 100 : 0;
      el.style.setProperty('--fill', pct.toFixed(1) + '%');
    });

    var hAtend = (atend * 22 * 2) / 60;      // 2 min de digitação repetida por atendimento
    var hCartao = cartao * 0.7;              // 70% da conferência manual
    var hNota = (nota * 1.5) / 60;           // 1,5 min por nota
    var hAvisos = (avisos * 4.33 * 40) / 3600; // 40 s por aviso enviado à mão

    var total = hAtend + hCartao + hNota + hAvisos;
    var horas = Math.round(total);

    resultado.textContent = horas + ' h/mês';

    if (detalhe) {
      var dias = (total / 8).toFixed(1).replace('.', ',');
      var maior = [
        { nome: 'a digitação repetida no atendimento', v: hAtend },
        { nome: 'a conferência de cartão e banco', v: hCartao },
        { nome: 'a emissão de notas', v: hNota },
        { nome: 'o envio manual de avisos', v: hAvisos }
      ].sort(function (a, b) { return b.v - a.v; })[0];

      detalhe.textContent = 'Equivale a cerca de ' + dias +
        ' dias de trabalho por mês. Hoje esse tempo se concentra em ' + maior.nome +
        ', e é por aí que ele começa a voltar.';
    }
  }

  Object.keys(campos).forEach(function (k) {
    if (campos[k]) campos[k].addEventListener('input', calcular);
  });
  calcular();

  /* --- gravações da rotina ---------------------------------------------
     Tocam só quando estão na tela, nunca com som, e param se a pessoa pedir
     ou se o sistema dela estiver configurado para reduzir animação.        */
  var clipes = Array.prototype.slice.call(document.querySelectorAll('.clip video'))
  var botaoClipes = document.getElementById('clips-toggle')

  if (clipes.length) {
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    var pausado = reduz

    function atualizarBotao() {
      if (!botaoClipes) return
      botaoClipes.textContent = pausado ? 'Tocar as gravações' : 'Pausar as gravações'
      botaoClipes.setAttribute('aria-pressed', String(pausado))
    }
    atualizarBotao()

    if ('IntersectionObserver' in window) {
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          var v = e.target
          if (e.isIntersecting && !pausado) {
            if (v.preload === 'none') v.preload = 'auto'
            v.play().catch(function () {})
          } else {
            v.pause()
          }
        })
      }, { threshold: 0.35 })
      clipes.forEach(function (v) { observador.observe(v) })
    }

    if (botaoClipes) {
      botaoClipes.addEventListener('click', function () {
        pausado = !pausado
        clipes.forEach(function (v) {
          if (pausado) v.pause()
          else { v.preload = 'auto'; v.play().catch(function () {}) }
        })
        atualizarBotao()
      })
    }
  }

  /* --- pedido de demonstração -------------------------------------------
     Envia para o agente comercial. Só segue com consentimento marcado, e o
     campo "website" é a isca de robô (a pessoa nunca o vê). Ninguém recebe
     mensagem automática: o contato é feito por uma pessoa da equipe.      */
  var formDemo = document.getElementById('demo-form');

  if (formDemo) {
    var ENDPOINT_LEAD = 'https://sysmax-sales-agent.vercel.app/api/public/lead';
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var botaoDemo = document.getElementById('demo-enviar');
    var statusDemo = document.getElementById('demo-status');
    var okDemo = document.getElementById('demo-ok');
    var textoBotao = botaoDemo ? botaoDemo.textContent : 'Pedir demonstração';
    var enviando = false;

    var telefoneValido = function (bruto) {
      var d = String(bruto || '').replace(/\D/g, '').replace(/^0+/, '');
      if (d.length === 10 || d.length === 11) d = '55' + d;
      if (d.indexOf('55') !== 0 || (d.length !== 12 && d.length !== 13)) return false;
      var ddd = parseInt(d.slice(2, 4), 10);
      return ddd >= 11 && ddd <= 99;
    };

    var regras = [
      { id: 'd-nome', erro: 'd-nome-erro', msg: 'Informe seu nome.',
        ok: function (el) { return el.value.trim().length >= 2; } },
      { id: 'd-fone', erro: 'd-fone-erro', msg: 'Informe um WhatsApp com DDD, por exemplo (16) 99999-9999.',
        ok: function (el) { return telefoneValido(el.value); } },
      { id: 'd-clinica', erro: 'd-clinica-erro', msg: 'Informe o nome da clínica.',
        ok: function (el) { return el.value.trim().length >= 2; } },
      { id: 'd-email', erro: 'd-email-erro', msg: 'Esse e-mail parece incompleto. Confira ou deixe em branco.',
        ok: function (el) { var v = el.value.trim(); return v === '' || EMAIL_RE.test(v); } },
      { id: 'd-aceite', erro: 'd-aceite-erro', msg: 'Marque a caixa para a equipe poder entrar em contato.',
        ok: function (el) { return el.checked; } }
    ];

    var marcarErro = function (regra, texto) {
      var el = document.getElementById(regra.id);
      var msg = document.getElementById(regra.erro);
      if (!el || !msg) return;
      el.setAttribute('aria-invalid', 'true');
      msg.textContent = texto;
      msg.hidden = false;
    };

    var limparErro = function (regra) {
      var el = document.getElementById(regra.id);
      var msg = document.getElementById(regra.erro);
      if (el) el.removeAttribute('aria-invalid');
      if (msg) { msg.textContent = ''; msg.hidden = true; }
    };

    regras.forEach(function (regra) {
      var el = document.getElementById(regra.id);
      if (el) el.addEventListener(regra.id === 'd-aceite' ? 'change' : 'input', function () { limparErro(regra); });
    });

    var mostrarStatus = function (texto, tipo, comWhats) {
      if (!statusDemo) return;
      statusDemo.textContent = texto;
      if (tipo) statusDemo.setAttribute('data-tipo', tipo); else statusDemo.removeAttribute('data-tipo');
      if (comWhats) {
        var a = document.createElement('a');
        a.className = 'link';
        a.textContent = 'chame no WhatsApp';
        a.setAttribute('href', linkWhats);
        a.setAttribute('rel', 'noopener');
        a.setAttribute('target', '_blank');
        statusDemo.appendChild(document.createTextNode(' '));
        statusDemo.appendChild(a);
        statusDemo.appendChild(document.createTextNode('.'));
      }
    };

    var terminarEnvio = function () {
      enviando = false;
      if (botaoDemo) { botaoDemo.disabled = false; botaoDemo.textContent = textoBotao; }
    };

    var enviarPedido = function () {
      enviando = true;
      if (botaoDemo) { botaoDemo.disabled = true; botaoDemo.textContent = 'Enviando…'; }
      mostrarStatus('', null, false);

      var corpo = {
        name: document.getElementById('d-nome').value.trim(),
        phone: document.getElementById('d-fone').value.trim(),
        clinic: document.getElementById('d-clinica').value.trim(),
        email: document.getElementById('d-email').value.trim(),
        website: document.getElementById('d-site').value,
        consent: true,
        page: window.location.pathname
      };
      if (REF) corpo.ref = REF;

      var ctrl = window.AbortController ? new AbortController() : null;
      var limite = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);

      fetch(ENDPOINT_LEAD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          return { ok: r.ok && j.ok === true, status: r.status, erro: typeof j.error === 'string' ? j.error : '' };
        });
      }).then(function (res) {
        clearTimeout(limite);
        if (res.ok) {
          formDemo.hidden = true;
          if (okDemo) { okDemo.hidden = false; okDemo.focus(); }
          return;
        }
        terminarEnvio();
        // 400 traz a mensagem específica do campo; 429, 500 e o resto são limite, falha nossa ou de rede
        if (res.status === 400 && res.erro) {
          mostrarStatus(res.erro, 'erro', false);
        } else if (res.status === 429) {
          mostrarStatus('Muitos envios seguidos. Tente de novo mais tarde ou', 'erro', true);
        } else {
          mostrarStatus('Não foi possível enviar agora. Tente de novo em instantes ou', 'erro', true);
        }
      }).catch(function () {
        clearTimeout(limite);
        terminarEnvio();
        mostrarStatus('Não conseguimos enviar. Confira a conexão e tente de novo, ou', 'erro', true);
      });
    };

    formDemo.addEventListener('submit', function (e) {
      e.preventDefault();
      if (enviando) return;
      mostrarStatus('', null, false);

      var primeiro = null;
      regras.forEach(function (regra) {
        var el = document.getElementById(regra.id);
        limparErro(regra);
        if (el && !regra.ok(el)) {
          marcarErro(regra, regra.msg);
          if (!primeiro) primeiro = el;
        }
      });

      if (primeiro) {
        mostrarStatus('Confira os campos destacados.', 'erro', false);
        primeiro.focus();
        return;
      }
      enviarPedido();
    });
  }

  /* --- ano do rodapé ---------------------------------------------------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
