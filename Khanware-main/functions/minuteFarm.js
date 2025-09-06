const originalFetch = window.fetch;

window.fetch = async function (input, init = {}) {
    let body;
    if (input instanceof Request) body = await input.clone().text();
    else if (init.body) body = init.body;
    if (features.minuteFarmer && body && input.url.includes("mark_conversions")) {
        try {
            if (body.includes("termination_event")) { sendToast("🚫 Limitador de tempo bloqueado.", 1000); return; }
        } catch (e) { debug(`🚨 Error @ minuteFarm.js\n${e}`); }
    }
    return originalFetch.apply(this, arguments);
};