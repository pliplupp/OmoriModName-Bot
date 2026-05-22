const { prefix, token } = require("./config.json");
const fs = require("fs");
const modnames = require('./modnames.json');
const { Client, Partials, Collection, Status, PresenceUpdateStatus, ActivityType } = require('discord.js');
const {GatewayIntentBits} = require("discord-api-types/v9");
const bot = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildMessageReactions,
      32768 // MessageContent was not recognized, so the integer equivalent is used here
    ],
    partials: [
      Partials.Channel,
      Partials.Message,
      Partials.User,
      
    ]
});

// Create a collection to store commands inside the bot object
bot.commands = new Collection();


// Load Command files from commands folder
const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(props.name, props)
}
// Get folders inside commands folder
const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))
// Load Command files from subfolders inside commands folder
commandSubFolders.forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
    for (const file of commandFiles) {
        const props = require(`./commands/${folder}/${file}`)
        console.log(`${file} loaded from ${folder}`)
        bot.commands.set(props.name, props)
    }
});
// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))
for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot))
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot))
    }
}

function checkModNames(message){
    var msg = message.content;
    for(var i = 0; i<modnames.names.length;i++){
        if(msg.toLowerCase().includes(modnames.names[i].toLowerCase())){
            console.log("omori mod name spotted");
            return true;
        }
    };
    if((msg.toLowerCase().includes("broke")) && (msg.toLowerCase().includes("dream"))){
            console.log("broken dreams");
            return true;
        }
    return false;
}
function checkStress(message){
    var msg = message.content;
    for(var i = 0; i<modnames.stressedout.length;i++){
        if(msg.toLowerCase().includes(modnames.stressedout[i].toLowerCase())){
            console.log("stressedout");
            return true;
        }
    };
    return false;
}
function checkAfraid(message){
    var msg = message.content;
    for(var i = 0; i<modnames.afraid.length;i++){
        if(msg.toLowerCase().includes(modnames.afraid[i].toLowerCase())){
            console.log("afraid");
            return true;
        }
    };
    return false;
}
function checkBurger(message){
    var msg = message.content;
    for(var i = 0; i<modnames.burgers.length;i++){
        if(msg.toLowerCase().includes(modnames.burgers[i].toLowerCase())){
            console.log("burgers on my mind");
            return true;
        }
    };
    return false;
}

bot.on('messageCreate', (message) => {
    if(message.author.bot){return;}
    if(checkModNames(message))
        {
            message.react("🛎️");
        }
    if(checkStress(message))
        {
            message.react('1507212231409008661');
        }
    if(checkAfraid(message))
        {
            if(Math.floor(Math.random() * (2 - 1 + 1) + 1) == 2) // Get random number, 1 or 2
                message.react('1507212206998163456'); // If 2, react with Omori
            else
                message.react('1507367048294957197'); // If 1, use Sunny
        }
    if(checkBurger(message))
        {
            message.react("🍔");
        }

    if(message.mentions.has(bot.user)){
        message.reply("Hello! This is <@!1506067533172707459>, a bot made by Pliplupp. <a:sunny_spin:1507091381900804198>")
    }

});


// Token needed in config.json
bot.login(token);
