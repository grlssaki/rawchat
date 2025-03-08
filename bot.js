const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const { WebSocketServer } = require('ws');
const dotenv = require('dotenv');

dotenv.config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const registeredServers = {};
const webSocketClients = {};

bot.once('ready', () => {
    console.log(`Bot connecté en tant que ${bot.user.tag}`);
});

bot.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const guildId = message.guild.id;

    if (!registeredServers[guildId]) {
        registeredServers[guildId] = {};
    }

    const serverData = registeredServers[guildId];

    if (message.content.startsWith('!register')) {
        const channelId = message.channel.id;
        serverData[channelId] = { messages: [] };
        message.channel.send(
            `Channel **${message.channel.name}** enregistré pour le serveur **${message.guild.name}**.`
        );
    }

    if (message.content.startsWith('!tell')) {
        const channelId = message.channel.id;

        if (serverData[channelId]) {
            const newMessage = {
                username: message.author.username,
                avatar: message.author.displayAvatarURL(),
                content: message.content.split(' ').slice(1).join(' '),
                attachments: message.attachments.map((attachment) => ({
                    url: attachment.url,
                    type: attachment.contentType,
                })),
            };

            serverData[channelId].messages.push(newMessage);

            if (webSocketClients[channelId]) {
                webSocketClients[channelId].forEach((ws) => {
                    ws.send(JSON.stringify(newMessage));
                });
            }

            // React to the message with a checkmark emoji
            message.react('✅');

        } else {
            message.channel.send(
                "Ce channel n'est pas enregistré. Utilisez `!register` pour commencer."
            );
        }
    }

    if (message.content.startsWith('!stell')) {
        const channelId = message.channel.id;

        if (serverData[channelId]) {
            const newMessage = {
                username: null, // Set username to null
                avatar: 'https://example.com/anonymous-avatar.png', // Placeholder avatar URL
                content: message.content.split(' ').slice(1).join(' '),
                attachments: message.attachments.map((attachment) => ({
                    url: attachment.url,
                    type: attachment.contentType,
                })),
            };

            serverData[channelId].messages.push(newMessage);

            if (webSocketClients[channelId]) {
                webSocketClients[channelId].forEach((ws) => {
                    ws.send(JSON.stringify(newMessage));
                });
            }

            message.channel.send(
                `Message anonyme ajouté pour le channel **${message.channel.name}**.`
            );
        } else {
            message.channel.send(
                "Ce channel n'est pas enregistré. Utilisez `!register` pour commencer."
            );
        }
    }

    if (message.content.startsWith('!help')) {
        const helpMessage = `
        **Commandes disponibles :**
        \`!register\` - Enregistrer le channel pour recevoir des messages.
        \`!tell <message>\` - Envoyer un message avec votre nom d'utilisateur.
        \`!stell <message>\` - Envoyer un message anonymement.
        \`!url\` - Obtenir l'URL pour afficher les messages.
        \`!help\` - Afficher ce message d'aide.
        `;
        message.channel.send(helpMessage);
    }

    if (message.content.startsWith('!url')) {
        const channelId = message.channel.id;
        const protocol = useSecureWs ? 'https' : 'http';
        const botLink = `${protocol}://${baseUrl}${webviewPort ? `:${webviewPort}` : ''}`;
        const url = `${botLink}/view/${channelId}`;
        message.channel.send(`URL pour le channel **${message.channel.name}**: ${url}`);
    }
});

bot.login(process.env.BOT_TOKEN);

// Web server
const app = express();
app.set('view engine', 'ejs');

app.get('/view/:channelId', (req, res) => {
    const channelId = req.params.channelId;
    const publicSocketUrl = process.env.PUBLIC_SOCKET_URL || null;
    res.render('index', {
        channelId,
        useSecureWs: process.env.USE_SECURE_WS === 'true',
        baseUrl: process.env.BASE_URL || 'localhost',
        wsPort: process.env.WS_PORT || '443',
        publicSocketUrl // Pass the public socket URL to the template
    });
});

// make it serve the CSS file in the public folder
app.use(express.static('public'));

const baseUrl = process.env.BASE_URL || 'localhost';
const webviewPort = process.env.WEBVIEW_PORT || 80;
const wsPort = process.env.WS_PORT || 443;
const useSecureWs = process.env.USE_SECURE_WS === 'true';

console.log(`Démarre le serveur web sur le port ${webviewPort} (adresse: ${baseUrl})`);

const server = app.listen(webviewPort, () =>
    console.log(`Serveur web démarré sur le port ${webviewPort}`)
);

const wss = new WebSocketServer({ port: wsPort });
console.log(`Serveur WebSocket démarré sur le port ${wsPort}`);

wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const channelId = params.get('channelId');

    if (!webSocketClients[channelId]) {
        webSocketClients[channelId] = [];
    }

    webSocketClients[channelId].push(ws);

    console.log(`Client connecté au channel ID: ${channelId}`);

    ws.on('close', () => {
        webSocketClients[channelId] = webSocketClients[channelId].filter(
            (client) => client !== ws
        );
        console.log(`Client déconnecté du channel ID: ${channelId}`);
    });
});
