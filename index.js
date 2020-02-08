//Discord Requires
const Discord = require('discord.js');
const bot = new Discord.Client();

//YouTube Requires
const search = require('youtube-search');
const ytdl = require('ytdl-core');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');

//Other Requires
const fs = require('fs');
const request = require('request-promise');
const manea = require('manea');

//Other Files
const config = require('./config.json');
const functions = require('./functions.js');
const trivia = require("./trivia.js");
const reddit = require("./reddit.js");

//Configs
const token = config.discord;
var opts = {
  maxResults: 10,
  key: config.youtube
};

//Music Variables
var voiceChannel;
var musicChannel;
var nowMusic;
var musicQueue = [];
var dispatcher;
var isPlaying = 0;


bot.on('ready', () => {
	console.log("Bot is up and running!");
	bot.user.setActivity('!help');
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
			message.reply("this command is disabled! Music Functions are being reworked.");
		} else if(words[0] == "volume") {
			message.reply("this command is disabled! Music Functions are being reworked.");
		} else if(words[0] == "leave") {
			message.reply("this command is disabled! Music Functions are being reworked.");
		} else if(words[0] == "clear") {
			message.reply("this command is disabled! Music Functions are being reworked.");
		} else if(words[0] == "queue") {
			message.reply("this command is disabled! Music Functions are being reworked.");
		} else if(words[0] == "skip") {
			message.reply("this command is disabled! Music Functions are being reworked.");
		} else if(words[0] == "play") {
			message.reply("this command is disabled! Music Functions are being reworked.");
		}
		else {
			message.author.send("Invalid command, please use !help in a chat room to see my commands!");
			message.delete();
		}
	}
});

bot.login(token);