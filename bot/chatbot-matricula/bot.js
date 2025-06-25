const { ActivityHandler, MessageFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

// Carregue o arquivo JSON com as perguntas
const faqData = require('../faq.json');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
       this.onMessage(async (context, next) => {
            const userText = context.activity.text.toLowerCase(); // Normaliza o texto do usuário
            let replyText = '';
            const dialogContext = await this.dialog.createContext(context);
            const results = await dialogContext.continueDialog();

            // Verifica se o usuario digitou "matrícula" ou "matricula"
            if (userText == 'matrícula' || userText == 'matricula') {
                    await dialogContext.beginDialog(this.dialog.id);
            // 1. VERIFICA SE A PERGUNTA ESTÁ NO FAQ
            }else if (faqData[userText]) {
                replyText = faqData[userText];
            } else {
            // 2. SE NÃO ESTIVER, RESPONDE UMA MENSAGEM PADRÃO
                replyText = `Desculpe, não entendi sua mensagem.`;
            }

            await context.sendActivity(MessageFactory.text(replyText, replyText));

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // Salva as mudanças de estado no final de cada turno.
        this.onTurn(async (context, next) => {
            await next();
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
