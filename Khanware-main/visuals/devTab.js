// Aguarda mudanças no DOM para inserir a aba
plppdo.on('domChanged', () => {
    if (document.getElementById('khanwareTab')) return;

    const nav = document.querySelector('nav[data-testid="side-nav"]');
    if (!nav) return;

    const section = document.createElement('section');
    section.id = 'khanwareTab';
    section.className = '_1ozlbq6';
    section.innerHTML = '<h2 class="_18undph9">Khanware</h2>';

    const ul = document.createElement('ul');
    const devTab = createNavTab('Developer', '#');

    devTab.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        openDevWindow();
    });

    ul.appendChild(devTab);
    section.appendChild(ul);
    nav.appendChild(section);
});

// Cria uma aba de navegação lateral
function createNavTab(name, href = '#') {
    const li = document.createElement('li');
    li.innerHTML = `<a class="_8ry3zep" href="${href}" target="_blank"><span class="_xy39ea8">${name}</span></a>`;
    return li;
}

// Abre janela de desenvolvedor
function openDevWindow() {
    const w = window.open('', '_blank');
    if (!w) return alert("Popup bloqueado pelo navegador!");

    window.khanwareWin = w;

    const html = `
        <html>
        <head>
            <title>Khanware Developer</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #121212;
                    color: #fff;
                    margin: 0;
                }
                .container {
                    width: min(90vw, 600px);
                    height: min(90vh, 600px);
                    padding: 20px;
                    border-radius: 10px;
                    background: #1e1e1e;
                    box-shadow: 0px 0px 15px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                h2 { text-align: center; margin-bottom: 10px; }
                .toggle-container {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 10px;
                }
                .toggle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #333;
                }
                .toggle strong { color: #fff; }
                .toggle small { color: #bbb; }
                .debug-box {
                    width: 90%;
                    height: 150px;
                    overflow-y: auto;
                    background: #000;
                    color: #ccc;
                    padding: 10px;
                    font-family: monospace;
                    white-space: pre-wrap;
                    border-radius: 5px;
                    border: 1px solid #333;
                    margin: 10px auto;
                }
                input[type="checkbox"] {
                    transform: scale(1.2);
                    cursor: pointer;
                }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #1e1e1e; }
                ::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Developer Options</h2>
                <div class="toggle-container" id="toggles"></div>
                <div class="debug-box" id="debugBox"></div>
            </div>
        </body>
        </html>
    `;

    w.document.write(html);

    // Aguarda a escrita do DOM
    w.onload = () => {
        createToggle('Debug Mode', 'Enables debugging logs', 'debugMode', window.debugMode || false);
        createToggle('Disable Security', 'Right-click and DevTools allowed', 'disableSecurity', window.disableSecurity || false);
        createToggle('Disable Ping Request', 'Blocks background ping checks', 'disablePing', window.disablePing || false);
    };
}

// Cria um switch (toggle) no menu de desenvolvedor
window.createToggle = function (name, desc, varName, toggled = false) {
    const w = window.khanwareWin;
    if (!w || w.closed) return;

    const container = w.document.getElementById('toggles');
    if (!container) return;

    const toggle = document.createElement('div');
    toggle.className = 'toggle';
    toggle.innerHTML = `
        <div>
            <strong>${name}</strong><br>
            <small>${desc}</small>
        </div>
        <input type="checkbox" id="toggle-${varName}" ${toggled ? 'checked' : ''}>
    `;

    toggle.querySelector('input').addEventListener('change', e => {
        window[varName] = e.target.checked;
        debug(`❕ ${name} set to ${e.target.checked}`);
    });

    container.appendChild(toggle);
};

// Log de depuração na janela
window.debug = function (message) {
    if (!window.khanwareWin || window.khanwareWin.closed || !window.debugMode) return;

    const box = window.khanwareWin.document.getElementById('debugBox');
    if (box) {
        box.innerHTML += message + '\n';
        box.scrollTop = box.scrollHeight;
    }
};

// Captura global de erros
window.onerror = function (message, source, lineno, colno, error) {
    debug(`🚨 Error @ ${source}:${lineno},${colno} \n${error?.stack || message}`);
    return true;
};
