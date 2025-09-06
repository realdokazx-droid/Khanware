// Utilitário para alterar variáveis aninhadas via path
const setFeatureByPath = (path, value) => {
    let obj = window;
    const parts = path.split('.');
    while (parts.length > 1) obj = obj[parts.shift()];
    obj[parts[0]] = value;
};

// Cria e adiciona elementos de configuração ao menu dropdown
function addFeature(features) {
    const feature = document.createElement('feature');

    features.forEach(attribute => {
        let element = attribute.type === 'nonInput'
            ? document.createElement('label')
            : document.createElement('input');

        if (attribute.type === 'nonInput') {
            element.innerHTML = attribute.name;
        } else {
            element.type = attribute.type;
            element.id = attribute.name;
        }

        // Atributos HTML adicionais
        if (attribute.attributes) {
            attribute.attributes.split(' ').forEach(attr => {
                const [key, value = ''] = attr.split('=');
                const cleanValue = value.replace(/"/g, '');
                key === 'style'
                    ? (element.style.cssText = cleanValue)
                    : element.setAttribute(key, cleanValue);
            });
        }

        if (attribute.variable) element.setAttribute('setting-data', attribute.variable);
        if (attribute.dependent) element.setAttribute('dependent', attribute.dependent);
        if (attribute.className) element.classList.add(attribute.className);

        if (attribute.labeled) {
            const label = document.createElement('label');
            if (attribute.className) label.classList.add(attribute.className);
            label.innerHTML = `${element.outerHTML} ${attribute.label}`;
            feature.appendChild(label);
        } else {
            feature.appendChild(element);
        }
    });

    dropdownMenu.innerHTML += feature.outerHTML;
}

// Escuta alterações dos inputs no menu
function handleInput(ids, callback = null) {
    const elements = Array.isArray(ids)
        ? ids.map(id => document.getElementById(id))
        : [document.getElementById(ids)];

    elements.forEach(element => {
        if (!element) return;

        const setting = element.getAttribute('setting-data');
        const dependent = element.getAttribute('dependent');

        const handleEvent = (e, value) => {
            setFeatureByPath(setting, value);
            if (callback) callback(value, e);
        };

        if (element.type === 'checkbox') {
            element.addEventListener('change', (e) => {
                playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav');
                handleEvent(e, e.target.checked);

                if (dependent) {
                    dependent.split(',').forEach(dep => {
                        document.querySelectorAll(`.${dep}`).forEach(depEl => {
                            depEl.style.display = e.target.checked ? null : 'none';
                        });
                    });
                }
            });
        } else {
            element.addEventListener('input', (e) => handleEvent(e, e.target.value));
        }
    });
}

/* Watermark personalizado no canto da tela */
Object.assign(watermark.style, {
    position: 'fixed',
    top: '0',
    left: device.mobile ? '55%' : '85%',
    width: '150px',
    height: '30px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    fontSize: '15px',
    fontFamily: 'MuseoSans, sans-serif',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'default',
    userSelect: 'none',
    padding: '0 10px',
    borderRadius: '10px',
    zIndex: '1001',
    transition: 'transform 0.3s ease'
});

watermark.innerHTML = `
    <span style="text-shadow: -1px 0.5px 0 #72ff72, -2px 0px 0 #2f672e;">KW</span>
    <span style="color:gray; padding-left:2px; font-family: Arial, sans-serif; font-size:10px">${ver}</span>
`;
document.body.appendChild(watermark);

// Drag do watermark
let isDragging = false, offsetX, offsetY;

watermark.addEventListener('mousedown', e => {
    if (!dropdownMenu.contains(e.target)) {
        isDragging = true;
        offsetX = e.clientX - watermark.offsetLeft;
        offsetY = e.clientY - watermark.offsetTop;
        watermark.style.transform = 'scale(0.9)';
    }
});

watermark.addEventListener('mouseup', () => {
    isDragging = false;
    watermark.style.transform = 'scale(1)';
});

document.addEventListener('mousemove', e => {
    if (isDragging) {
        let newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - watermark.offsetWidth));
        let newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - watermark.offsetHeight));
        Object.assign(watermark.style, { left: `${newX}px`, top: `${newY}px` });
        dropdownMenu.style.display = 'none';
    }
});

/* Dropdown menu */
Object.assign(dropdownMenu.style, {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '160px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '13px',
    fontFamily: 'Monospace, sans-serif',
    display: 'none',
    flexDirection: 'column',
    zIndex: '1000',
    padding: '5px',
    cursor: 'default',
    userSelect: 'none',
    transition: 'transform 0.3s ease',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)'
});

dropdownMenu.innerHTML = `
    <style>
        input[type="checkbox"] {
            appearance: none; width: 15px; height: 15px; background-color: #3a3a3b;
            border: 1px solid #acacac; border-radius: 3px; margin-right: 5px; cursor: pointer;
        }
        input[type="checkbox"]:checked {
            background-color: #540b8a; border-color: #720fb8;
        }
        input[type="text"], input[type="number"], input[type="range"] {
            width: calc(100% - 10px); border: 1px solid #343434;
            color: white; background: none; padding: 3px;
            border-radius: 3px; accent-color: #540b8a;
        }
        label {
            display: flex; align-items: center; color: #3a3a3b; padding-top: 3px;
        }
    </style>
`;

watermark.appendChild(dropdownMenu);

// Lista de recursos a renderizar
let featuresList = [
    { name: 'questionSpoof', type: 'checkbox', variable: 'features.questionSpoof', attributes: 'checked', labeled: true, label: 'Question Spoof' },
    { name: 'videoSpoof', type: 'checkbox', variable: 'features.videoSpoof', attributes: 'checked', labeled: true, label: 'Video Spoof' },
    { name: 'showAnswers', type: 'checkbox', variable: 'features.showAnswers', labeled: true, label: 'Answer Revealer' },
    { name: 'autoAnswer', type: 'checkbox', variable: 'features.autoAnswer', dependent: 'autoAnswerDelay,nextRecomendation,repeatQuestion', labeled: true, label: 'Auto Answer' },
    { name: 'repeatQuestion', className: 'repeatQuestion', type: 'checkbox', variable: 'features.repeatQuestion', attributes: 'style="display:none;"', labeled: true, label: 'Repeat Question' },
    { name: 'nextRecomendation', className: 'nextRecomendation', type: 'checkbox', variable: 'features.nextRecomendation', attributes: 'style="display:none;"', labeled: true, label: 'Recomendations' },
    { name: 'autoAnswerDelay', className: 'autoAnswerDelay', type: 'range', variable: 'features.autoAnswerDelay', attributes: 'style="display:none;" min="1" max="3" value="1"' },
    { name: 'minuteFarm', type: 'checkbox', variable: 'features
