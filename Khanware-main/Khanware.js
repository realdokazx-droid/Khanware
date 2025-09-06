// ==UserScript==
// @name         Khanware Cleaner
// @version      4.0.1
// @description  Ferramenta Educativa para Khan Academy (Interface, Estilo e Automação)
// @match        *://*.khanacademy.org/*
// @grant        none
// ==/UserScript==

(async () => {
  "use strict";

  /** ========== CONFIGURAÇÕES ========== */
  const VERSION = "4.0.1";
  const IS_DEV = false;
  const REPO_PATH = "https://raw.githubusercontent.com/realdokazx-droid/Khanware/main/Khanware-main/";

  /** ========== ESTADO GLOBAL ========== */
  const state = {
    user: {
      username: "Username",
      nickname: "Nickname",
      UID: "00000"
    },
    features: {
      questionSpoof: true,
      videoSpoof: true,
      showAnswers: false,
      autoAnswer: false
    },
    config: {
      autoAnswerDelay: 3
    },
    loadedPlugins: []
  };

  /** ========== UTILIDADES ========== */
  const utils = {
    delay: ms => new Promise(res => setTimeout(res, ms)),

    loadScript: async (url, label) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Falha ao carregar script ${label}: HTTP ${response.status}`);
        const code = await response.text();
        state.loadedPlugins.push(label);
        eval(code);
      } catch (err) {
        console.error(`Erro ao carregar script ${label}:`, err);
      }
    },

    loadCss: url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }
    },

    toast: (msg, duration = 3000) => {
      if (window.Toastify) {
        Toastify({
          text: msg,
          duration,
          gravity: "bottom",
          position: "center",
          stopOnFocus: true,
          style: { background: "#000" }
        }).showToast();
      } else {
        console.log("[Toast]", msg);
      }
    },

    isApple: () => /iPhone|iPad|Macintosh|Mac OS X/i.test(navigator.userAgent),
    isMobile: () => /Android|iPhone|Tablet|Mobile/i.test(navigator.userAgent)
  };

  // Definir debug para evitar erro
  if (!window.debug) window.debug = (...args) => console.debug(...args);

  /** ========== VERIFICAÇÕES INICIAIS ========== */
  if (!/khanacademy\.org/.test(window.location.hostname)) {
    alert("❌ Só pode ser executado no Khan Academy.");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }

  /** ========== SPLASH SCREEN ========== */
  const showSplash = () => {
    if (document.getElementById("khanware-splash")) return; // evitar duplicação

    const splash = document.createElement("div");
    splash.id = "khanware-splash";
    splash.style = `
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:#000; color:white; font-family:sans-serif;
      display:flex; align-items:center; justify-content:center;
      font-size:2rem; z-index:9999; opacity:0; transition:opacity .5s;
    `;
    splash.innerHTML = `<span>KHANWARE</span><span style="color:#72ff72;">.SPACE</span>`;
    document.body.appendChild(splash);
    setTimeout(() => (splash.style.opacity = "1"), 10);
  };

  const hideSplash = () => {
    const splash = document.getElementById("khanware-splash");
    if (!splash) return;
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 1000);
  };

  /** ========== OBTER USUÁRIO DA PÁGINA (fallback) ========== */
  function getUsernameFromPage() {
    try {
      // Tenta pegar do objeto global KA
      if (window.KA && KA.currentUser && KA.currentUser.username) {
        return KA.currentUser.username;
      }

      // Busca seletor comum que contenha username
      const el = document.querySelector('.username') || document.querySelector('[data-username]');
      if (el) return el.textContent.trim();

      return "Desconhecido";
    } catch (e) {
      return "Desconhecido";
    }
  }

  /** ========== BUSCAR PERFIL DO USUÁRIO VIA API ========== */
  const loadUserProfile = async () => {
    // Atenção: essa API interna requer autenticação adequada, então provavelmente gerará erro 403.
    // Vamos evitar chamar essa API para não causar erro.
    // Em vez disso, só usar o fallback do objeto global ou DOM.
    return null;
  };

  /** ========== CARREGAR DEPENDÊNCIAS ========== */
  const loadDependencies = async () => {
    await Promise.all([
      utils.loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"),
      utils.loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "toastify")
    ]);
  };

  /** ========== CARREGAR FUNCIONALIDADES ========== */
  const loadModules = async () => {
    const modules = [
      "functions/questionSpoof.js",
      "functions/videoSpoof.js",
      "functions/autoAnswer.js",
      "visuals/mainMenu.js"
    ];

    for (const module of modules) {
      await utils.loadScript(REPO_PATH + module, module.split("/").pop());
    }
  };

  /** ========== EXECUÇÃO ========== */
  showSplash();

  await loadDependencies();

  // Não usar API protegida, apenas fallback seguro
  let user = await loadUserProfile();

  if (!user) {
    const username = getUsernameFromPage();
    user = { username, nickname: username, UID: "00000" };
  }

  state.user = user;

  utils.toast("🌿 Khanware carregado com sucesso!");
  utils.toast(`⭐ Bem-vindo(a), ${state.user.nickname}`);

  if (utils.isApple()) {
    await utils.delay(500);
    utils.toast("🪽 Que tal um Samsung?");
  }

  await loadModules();

  hideSplash();

})();
