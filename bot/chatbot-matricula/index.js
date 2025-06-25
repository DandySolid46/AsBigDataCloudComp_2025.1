const path = require('path');
const restify = require('restify');

const { BotFrameworkAdapter, ConversationState, UserState, MemoryStorage } = require('botbuilder');
const { EchoBot } = require('./bot');
const { EnrollmentDialog } = require('../dialogs/enrollmentDialog');

// Carrega as variáveis de ambiente.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Cria o adaptador do bot.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${ error }`);
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Define o armazenamento em memória para o estado da conversa.
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Cria a instância do diálogo de matrícula.
const enrollmentDialog = new EnrollmentDialog();
// Cria a instância do bot principal, passando os estados e o diálogo.
const bot = new EchoBot(conversationState, userState, enrollmentDialog);

// Cria o servidor HTTP.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator and point it at http://localhost:3978/api/messages');
});

// Endpoint que escuta as mensagens do usuário.
server.post('/api/messages', async (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
