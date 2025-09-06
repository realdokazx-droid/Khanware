if (!device.mobile) {
    // Evita múltiplas execuções
    if (!window.__discordWidgetInjected) {
        window.__discordWidgetInjected = true;

        // Cria e configura o script de integração do WidgetBot
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
        script.async = true;

        // Após carregar o script, inicializa o widget
        script.onload = () => {
            const discEmbed = new Crate({
                server: '1286573512831533056',
                channel: '1286573601687867433',
                location: ['bottom', 'right'],
                color: '#000000',
                notifications: true,
                indicator: true,
                allChannelNotifications: true,
                defer: false
            });

            // Só mostra o widget na página de perfil
            plppdo.on('domChanged', () => {
                const isOnProfile = window.location.href.includes("khanacademy.org/profile");
                isOnProfile ? discEmbed.show() : discEmbed.hide();
            });
        };

        // Injeta o script no corpo da página
        document.body.appendChild(script);
    }
}
