const baseSelectors = [
    `[data-testid="choice-icon__library-choice-icon"]`, // Alternativas da questão
    `[data-testid="exercise-check-answer"]`,            // Botão "Responder"
    `[data-testid="exercise-next-question"]`,           // Botão "Próxima questão"
    `._1udzurba`,                                       // Ícone de “tarefa concluída”
    `._awve9b`                                          // Outro possível botão
];

khanwareDominates = true;

(async () => {
    while (khanwareDominates) {
        try {
            if (features.autoAnswer && features.questionSpoof) {

                // Clona os seletores base
                const selectorsToCheck = [...baseSelectors];

                // Condicionalmente adiciona seletores extras
                if (features.nextRecomendation) selectorsToCheck.push("._hxicrxf");     // Sugestão de próxima atividade
                if (features.repeatQuestion) selectorsToCheck.push("._ypgawqo");        // Repetir pergunta

                for (const selector of selectorsToCheck) {
                    findAndClickBySelector(selector);

                    const element = document.querySelector(`${selector} > div`);
                    if (element && element.innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
            }
        } catch (err) {
            console.warn("[Khanware] Erro ao processar autoAnswer:", err);
        }

        // Delay baseado no slider de delay (valor invertido)
        const waitTime = (featureConfigs.autoAnswerDelay || 1) * 800;
        await delay(waitTime);
    }
})();
