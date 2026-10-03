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

  /* --- ano do rodapé ---------------------------------------------------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
