//Discord Requires
const Discord = require('discord.js');
const bot = new Discord.Client();

//Other Files
const config = require('./config.json');
const functions = require('./functions.js');
const trivia = require("./trivia.js");
const reddit = require("./reddit.js");
const music = require("./music.js");
const summarize = require("./smmry.js");

//Configs
const token = config.discord;

bot.on('ready', () => {
    console.log("Bot is up and running!");
    bot.user.setActivity('!help');
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.user == bot.user) {
        if (newMember.voiceChannel == null)
            music.closeChannel();
        if (newMember.voiceChannel != null && oldMember.voiceChannel != null)
            music.setChannel(newMember.voiceChannel);
        if (newMember.voiceChannel != null)
            music.setBot(bot.user);
    }
});

bot.on('message', message => {
    if (message.author.bot) return;

    if (message.content.indexOf('!') === 0) {
        var text = message.content.substring(1);
        var words = text.split(" ");

        switch (words[0]) {
            case "help":
                functions.sendHelpMessage(message.author);
                message.delete();
                break;
            case "quote":
                if (words[1] != null && words[2] != null && message.mentions.everyone == false && message.mentions.users.first() != null) {
                    functions.quoteMessage(message.channel, message.mentions.users.first(), words);
                } else {
                    message.reply("Usage: !quote [@User] [Message]");
                }
                break;
            case "cat":
                functions.requestImage("cat", message);
                break;
            case "dog":
                functions.requestImage("dog", message);
                break;
            case "team":
                functions.getRandomTeam(message);
                break;
            case "trivia":
                trivia.getTrivia(message);
                break;
            case "answer":
                trivia.answer(message, words);
                break;
            case "join":
                music.join(message);
                break;
            case "volume":
                music.volume(message, words);
                break;
            case "leave":
                music.leave(message);
                break;
            case "clear":
                music.clearQueue(message);
                break;
            case "queue":
                music.queue(message, words);
                break;
            case "skip":
                music.skip(message);
                break;
            case "play":
                music.play(message, words);
                break;
            case "summarize":
                summarize.get(message, words[1]);
                message.delete();
                break;
            case "summary":
                summarize.get(message, words[1]);
                message.delete();
                break;
            case "meme":
                reddit.send(message, words[0]);
                break;
            case "4chan":
                reddit.send(message, words[0]);
                break;
            case "dank":
                reddit.send(message, "dankmemes");
                break;
            case "facepalm":
                reddit.send(message, words[0]);
                break;
            case "meirl":
                reddit.send(message, words[0]);
                break;
            case "memeeconomy":
                reddit.send(message, words[0]);
                break;
            case "deep":
                reddit.send(message, "im14andthisisdeep");
                break;
            case "niceguys":
                reddit.send(message, words[0]);
                break;
            case "nicegirls":
                reddit.send(message, words[0]);
                break;
            case "leaguememe":
                reddit.send(message, "leagueofmemes");
                break;
            case "lwiay":
                reddit.send(message, "pewdiepiesubmissions");
                break;
            case "loop":
                reddit.send(message, "perfectloops");
                break;
            case "hmmm":
                reddit.send(message, words[0]);
                break;
            case "woooosh":
                reddit.send(message, words[0]);
                break;
            case "fellowkids":
                reddit.send(message, words[0]);
                break;
            case "pics":
                reddit.send(message, words[0]);
                break;
            default:
                message.author.send("Invalid command, please use !help in a chat room to see my commands!");
                message.delete();
        }
    }
});

bot.login(token);