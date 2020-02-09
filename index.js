//Discord Requires
const Discord = require('discord.js');
const bot = new Discord.Client();

//Other Files
const config = require('./config.json');
const functions = require('./functions.js');
const trivia = require("./trivia.js");
const reddit = require("./reddit.js");
const music = require("./music.js");

//Configs
const token = config.discord;

bot.on('ready', () => {
	console.log("Bot is up and running!");
	bot.user.setActivity('!help');
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
	if(newMember.user == bot.user) {
		if(newMember.voiceChannel == null)
			music.closeChannel();
		if(newMember.voiceChannel != null && oldMember.voiceChannel != null)
			music.setChannel(newMember.voiceChannel);
		if(newMember.voiceChannel != null)
			music.setBot(bot.user);
	}
});

bot.on('message', message => {
	if(message.author.bot) return;
	
	if(message.content.indexOf('!') === 0) {
		var text = message.content.substring(1);
		var words = text.split(" ");

		if(words[0] == "help") {
			functions.sendHelpMessage(message.author);
			message.delete();
		} else if(words[0] == "quote") {
			if(words[1] != null && words[2] != null && message.mentions.everyone == false && message.mentions.users.first() != null) {
				functions.quoteMessage(message.channel, message.mentions.users.first(), words);
			} else {
				message.reply("Usage: !quote [@User] [Message]");
			}
		} else if(words[0] == "cat") {
			functions.requestImage("cat", message);
		} else if(words[0] == "dog") {
			functions.requestImage("dog", message);
		} else if(words[0] == "team") {
			functions.getRandomTeam(message);
		} else if(words[0] == "meme") {
			reddit.send(message, words[0]);
		} else if(words[0] == "4chan") {
			reddit.send(message, words[0]);
		} else if(words[0] == "blacktwitter") {
			reddit.send(message, words[0]);
		} else if(words[0] == "dank") {
			reddit.send(message, words[0]);
		} else if(words[0] == "facepalm") {
			reddit.send(message, words[0]);
		} else if(words[0] == "meirl") {
			reddit.send(message, words[0]);
		} else if(words[0] == "memeeconomy") {
			reddit.send(message, words[0]);
		} else if(words[0] == "wholesome") {
			reddit.send(message, words[0]);
		} else if(words[0] == "deep") {
			reddit.send(message, "im14andthisisdeep");
		} else if(words[0] == "niceguys") {
			reddit.send(message, words[0]);
		} else if(words[0] == "nicegirls") {
			reddit.send(message, words[0]);
		} else if(words[0] == "leaguememe") {
			reddit.send(message, "leagueofmemes");
		} else if(words[0] == "lwiay") {
			reddit.send(message, "PewdiepieSubmissions");
		} else if(words[0] == "loop") {
			reddit.send(message, "perfectloops");
		} else if(words[0] == "hmmm") {
			reddit.send(message, words[0]);
		} else if(words[0] == "woooosh") {
			reddit.send(message, words[0]);
		} else if(words[0] == "pcmr") {
			reddit.send(message, "pcmasterrace");
		} else if(words[0] == "fellowkids") {
			reddit.send(message, words[0]);
		} else if(words[0] == "trivia") {
			trivia.getTrivia(message);
		} else if(words[0] == "answer") {
			trivia.answer(message, words);
		} else if(words[0] == "join") {
			music.join(message);
		} else if(words[0] == "volume") {
			music.volume(message, words);
		} else if(words[0] == "leave") {
			music.leave(message);
		} else if(words[0] == "clear") {
			music.clearQueue(message);
		} else if(words[0] == "queue") {
			music.queue(message, words);
		} else if(words[0] == "skip") {
			music.skip(message);
		} else if(words[0] == "play") {
			music.play(message, words);
		}
		else {
			message.author.send("Invalid command, please use !help in a chat room to see my commands!");
			message.delete();
		}
	}
});

bot.login(token);