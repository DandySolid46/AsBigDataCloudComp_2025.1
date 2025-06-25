const { ActivityHandler, MessageFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

// Carregue o arquivo JSON com as perguntas
const faqData = require('../faq.json');

class EchoBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();

        if (!conversationState) throw new Error('[EchoBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[EchoBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[EchoBot]: Missing parameter. dialog is required');


        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.dialogSet = new DialogSet(this.dialogState);
        this.dialogSet.add(this.dialog);

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
       this.onMessage(async (context, next) => {
            // Normaliza o texto do usuário
            const userText = context.activity.text.toLowerCase(); 
            let replyText = '';
            const dialogContext = await this.dialogSet.createContext(context);
            const results = await dialogContext.continueDialog();

            // Se o diálogo já estiver ativo, não processa a mensagem
            if (results.status === DialogTurnStatus.empty) {
                // Verifica se o usuario digitou "matrícula" ou "matricula"
                if (userText == 'matrícula' || userText == 'matricula') {
                        await dialogContext.beginDialog(this.dialog.id);
                } else {
                    // VERIFICA SE A PERGUNTA ESTÁ NO FAQ
                    if (faqData[userText]) {
                        replyText = faqData[userText];
                    } else {
                    // SE NÃO ESTIVER, RESPONDE UMA MENSAGEM PADRÃO
                    replyText = `Desculpe, não entendi sua mensagem.`;
                    }
                    await context.sendActivity(MessageFactory.text(replyText, replyText));
                }
            }
            
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();

        });
        

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Bem vindo, em que posso ajudar?';
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
