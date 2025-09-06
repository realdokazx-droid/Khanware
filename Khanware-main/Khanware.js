// ==UserScript==
// @name         Khanware Cleaner
// @version      4.0.0
// @description  Ferramenta Educativa para Khan Academy (Interface, Estilo e Automação)
// @match        *://*.khanacademy.org/*
// @grant        none
// ==/UserScript==

(async () => {
  "use strict";

  // Definir debug para evitar erro no console
  window.debug = (...args) => console.debug(...args);

  /** ========== CONFIGURAÇÕES ========== */
  const VERSION = "4.0.0";
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
        const code = await fetch(url).then(r => r.text());
        state.loadedPlugins.push(label);
        eval(code);
      } catch (err) {
        console.error(`Erro ao carregar script ${label}:`, err);
      }
    },

    loadCss: url => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    },

    toast: (msg, duration = 3000) => {
      Toastify({
        text: msg,
        duration,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        style: { background: "#000" }
      }).showToast();
      console.debug(`[Toast] ${msg}`);
    },

    isApple: () => /iPhone|iPad|Macintosh|Mac OS X/i.test(navigator.userAgent),
    isMobile: () => /Android|iPhone|Tablet|Mobile/i.test(navigator.userAgent)
  };

  /** ========== VERIFICAÇÕES INICIAIS ========== */
  if (!/khanacademy\.org/.test(window.location.hostname)) {
    alert("❌ Só pode ser executado no Khan Academy.");
    window.location.href = "https://pt.khanacademy.org/";
    return;
  }

  /** ========== SPLASH SCREEN ========== */
  const showSplash = () => {
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

  /** ========== BUSCAR PERFIL DO USUÁRIO ========== */
  const loadUserProfile = async () => {
    try {
      const res = await fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          operationName: "getFullUserProfile",
          query: `query { user { id username nickname } }`
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const userData = data.data.user;

      state.user = {
        username: userData.username,
        nickname: userData.nickname,
        UID: userData.id.slice(-5)
      };
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      state.user = { username: "Desconhecido", nickname: "Visitante", UID: "00000" };
    }
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
  await loadUserProfile();

  utils.toast("🌿 Khanware carregado com sucesso!");
  utils.toast(`⭐ Bem-vindo(a), ${state.user.nickname}`);

  if (utils.isApple()) {
    await utils.delay(500);
    utils.toast("🪽 Que tal um Samsung?");
  }

  await loadModules();

  hideSplash();
})();
