const originalParse = JSON.parse;

JSON.parse = function (text, reviver) {
    let body = originalParse(text, reviver);

    try {
        if (!features.showAnswers || !body?.data) return body;

        for (const key of Object.keys(body.data)) {
            const data = body.data[key];

            // Só mexe se for um item de avaliação válido
            if (key === "assessmentItem" && data?.item) {
                try {
                    const itemObj = JSON.parse(data.item.itemData);
                    const question = itemObj?.question;

                    if (!question?.widgets) continue;

                    let revealed = false;

                    for (const widgetKey in question.widgets) {
                        const widget = question.widgets[widgetKey];
                        if (!widget?.options?.choices) continue;

                        widget.options.choices.forEach(choice => {
                            if (choice.correct && !choice.content.startsWith("✅")) {
                                choice.content = "✅ " + choice.content;
                                revealed = true;
                            }
                        });
                    }

                    if (revealed) {
                        sendToast("🔓 Respostas reveladas.", 1000);
                        debug(`[KW] ✅ Respostas reveladas para '${question.content?.slice(0, 60) || "..." }'`);
                    }

                    data.item.itemData = JSON.stringify(itemObj);
                } catch (err) {
                    debug(`⚠️ Erro ao processar itemData: ${err}`);
                }
            }
        }
    } catch (err) {
        debug(`🚨 Erro em answerRevealer JSON Hook:\n${err}`);
    }

    return body;
};
