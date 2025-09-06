// Estilos do painel flutuante
Object.assign(statsPanel.style, {
    position: 'fixed',
    top: '95%',
    left: '20px',
    width: '250px',
    height: '30px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'default',
    borderRadius: '10px',
    userSelect: 'none',
    zIndex: '1000',
    transition: 'transform 0.3s',
    backdropFilter: 'blur(1.5px)',
    WebkitBackdropFilter: 'blur(1.5px)'
});

// Obtem o ping (HEAD request)
const getPing = async () => {
    if (window.disablePing) return ':( ';
    try {
        const start = performance.now();
        await fetch('https://pt.khanacademy.org/', { method: 'HEAD' });
        return Math.round(performance.now() - start);
    } catch {
        return 'Error';
    }
};

// FPS calculation
let lastFrame = performance.now(), frameCount = 0, fps = 0;
(function calcFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastFrame >= 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastFrame));
        frameCount = 0;
        lastFrame = now;
    }
    requestAnimationFrame(calcFPS);
})();

// Hora atual formatada
const getTime = () => new Date().toLocaleTimeString();

// Atualiza o conteúdo do painel
const updateStats = async () => {
    statsPanel.innerHTML = `
        <span style="text-shadow: -1px 0.5px 0 #72ff72, -2px 0px 0 #2f672e;">KW</span>
        <span style="margin: 0 8px;">|</span><span>${fps}fps</span>
        <span style="margin: 0 8px;">|</span><span>${await getPing()}ms</span>
        <span style="margin: 0 8px;">|</span><span>${getTime()}</span>
    `;
};

// Inicia a atualização periódica
updateStats();
document.body.appendChild(statsPanel);
setInterval(updateStats, 1000);

// Funcionalidade de arrastar o painel
let isDragging = false, offsetX = 0, offsetY = 0;

statsPanel.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - statsPanel.offsetLeft;
    offsetY = e.clientY - statsPanel.offsetTop;
    statsPanel.style.transform = 'scale(0.9)';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    statsPanel.style.transform = 'scale(1)';
});

document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - statsPanel.offsetWidth));
    const newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - statsPanel.offsetHeight));
    Object.assign(statsPanel.style, { left: `${newX}px`, top: `${newY}px` });
});

// Mobile: mostrar apenas em páginas de perfil
if (device.mobile) {
    plppdo.on('domChanged', () => {
        const isProfile = window.location.href.includes("khanacademy.org/profile");
        statsPanel.style.display = isProfile ? 'flex' : 'none';
    });
}
