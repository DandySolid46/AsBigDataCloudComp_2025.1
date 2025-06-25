const { ComponentDialog, WaterfallDialog, TextPrompt, NumberPrompt } = require('./botbuilder-dialogs');
const axios = require('axios'); // Para fazer a chamada para o backend

// Nomes para os diálogos e prompts que usaremos
const ENROLLMENT_WATERFALL_DIALOG = 'enrollmentWaterfallDialog';
const TEXT_PROMPT = 'textPrompt';

class EnrollmentDialog extends ComponentDialog {
    constructor() {
        super('enrollmentDialog');

        // Adiciona os diálogos que farão parte do fluxo
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new WaterfallDialog(ENROLLMENT_WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.emailStep.bind(this),
            this.courseStep.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = ENROLLMENT_WATERFALL_DIALOG;
    }

    /**
     * PASSO 1: Pede o nome do usuário.
     */
    async nameStep(stepContext) {
        console.log('DIALOG: Executando nameStep');
        return await stepContext.prompt(TEXT_PROMPT, 'Para começar, por favor, me diga seu nome completo.');
    }

    /**
     * PASSO 2: Salva o nome e pede o e-mail.
     */
    async emailStep(stepContext) {
        console.log('DIALOG: Executando emailStep');
        // Salva o nome que o usuário digitou no passo anterior.
        stepContext.values.nome = stepContext.result;

        return await stepContext.prompt(TEXT_PROMPT, `Obrigado, ${stepContext.values.nome}. Agora, qual é o seu melhor e-mail?`);
    }

    /**
     * PASSO 3: Salva o e-mail e pede o curso.
     */
    async courseStep(stepContext) {
        console.log('DIALOG: Executando courseStep');
        // Salva o e-mail.
        stepContext.values.email = stepContext.result;

        return await stepContext.prompt(TEXT_PROMPT, 'Ótimo! Para qual curso você deseja se matricular?');
    }

    /**
     * PASSO 4: Salva o curso, envia para a API e finaliza.
     */
    async summaryStep(stepContext) {
        console.log('DIALOG: Executando summaryStep');
        // Salva o curso.
        stepContext.values.curso = stepContext.result;

        await stepContext.context.sendActivity('Obrigado! Estou processando sua matrícula, um momento...');

        try {
            // Monta o corpo da requisição para o backend.
            const matriculaData = {
                nome: stepContext.values.nome,
                email: stepContext.values.email,
                curso: stepContext.values.curso
            };

            // Faz a requisição POST para o backend.
            // Certifique-se de que sua API backend (feita em Spring Boot) está rodando!
            const response = await axios.post('http://localhost:8080/api/matriculas', matriculaData);

            // Envia a resposta do backend para o usuário.
            await stepContext.context.sendActivity(response.data);

        } catch (error) {
            console.error('ERRO AO ENVIAR MATRÍCULA:', error);
            await stepContext.context.sendActivity('Desculpe, tive um problema ao processar sua matrícula. Tente novamente mais tarde.');
        }

        // Finaliza o diálogo em cascata.
        return await stepContext.endDialog();
    }
}

module.exports.EnrollmentDialog = EnrollmentDialog;