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
const lowerCase = require('lower-case');
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

//Trivia Variables
var triviaon = 0;


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
			if(!triviaon) {
				trivia.trivia(function(msg, answer1, answer2, answer3, answer4) {
					message.channel.send(msg);
					message.channel.send("A) " + answer1 + " | B) " + answer2 + " | C) " + answer3 + " | D) " + answer4);
				});
				triviaon = 1;
			} else {
				var json = JSON.parse(fs.readFileSync('trivia.json', 'utf8'));
					
				message.channel.send(json[0]);
				message.channel.send("A) " + json[1] + " | B) " + json[2] + " | C) " + json[3] + " | D) " + json[4]);
			}
		} else if(words[0] == "answer") {
			if(triviaon) {
				if(words[1] && (lowerCase(words[1]) == "a" || lowerCase(words[1]) == "b" || lowerCase(words[1]) == "c" || lowerCase(words[1]) == "d")) {
					triviaon = 0;
					var answerr = trivia.check_answer(lowerCase(words[1]));
					if(answerr == 1) {
						message.channel.send("You have answered correctly!");
					} else {
						message.channel.send("Wrong answer. Correct answer: " + answerr);
					}
				} else {
					message.reply("usage: !answer <a|b|c|d>");
				}
			} else {
				message.reply("there is no trivia question. You can request one by writing !trivia.");
			}
		} else if(words[0] == "join") {
			if(voiceChannel == message.member.voiceChannel) {
				message.reply("I'm already in this voice channel.");
			}
			else if(voiceChannel) {
				message.reply("I'm already in a voice channel: " + voiceChannel.name);
			} else {
				if(!message.member.voiceChannel) {
					message.reply("you're not in a voice channel.");
				} else {
					voiceChannel = message.member.voiceChannel;
					musicChannel = message.channel;
					musicQueue = [];
					voiceChannel.join();
					console.log("Joining: " + voiceChannel + ".");
					console.log(" ");
				}
			}
		} else if(words[0] == "volume") {
			if(voiceChannel && voiceChannel == message.member.voiceChannel)
				if(words[1] >= 0 && words[1] <= 100) {
					dispatcher.setVolume(words[1] / 100);
				} else {
					message.reply("usage !volume <0 - 100>");
				}
		} else if(words[0] == "leave") {
			if(voiceChannel && voiceChannel == message.member.voiceChannel) {
				musicQueue = 0;
				isPlaying = 0;
				dispatcher = null;
				voiceChannel.leave();
				voiceChannel = null;
				musicChannel = null;
			}
		} else if(words[0] == "clear") {
			musicQueue = 0;
			dispatcher.end();
			isPlaying = 0;
		} else if(words[0] == "queue") {
			if(musicQueue.length) {
				var queueText = "";
				
				for(var k = 0; k < musicQueue.length; k++) {
					queueText = queueText + (k+1) + ". " + musicQueue[k][1] + " [" + functions.secondsToMinutes(musicQueue[k][2]) + "]" + "\n";
					if(k == 9 && musicQueue.length > 10) {
						queueText = queueText + "... and " + (musicQueue.length - 10) + " other songs.";
						break;
					}
				}
				
				message.channel.send({embed: {
					title: "Music Queue",
					fields: [{
						name: "Now Playing:",
						value: nowMusic[1] + " [" + functions.secondsToMinutes(Math.floor(dispatcher.time/1000)) + "/" + functions.secondsToMinutes(nowMusic[2]) + "]"
					},
					{
						name: "Next Songs",
						value: queueText
					}],
				}});
			} else {
				message.reply("there is nothing in the queue.");
			}
		} else if(words[0] == "skip") {
			if(voiceChannel == message.member.voiceChannel && isPlaying == 1)
				dispatcher.end();
			
			if(musicQueue == 0)
				musicQueue = [];
		} else if(words[0] == "play") {
			if(musicQueue == 0)
				musicQueue = [];
			
			if(!voiceChannel && message.member.voiceChannel) {
				voiceChannel = message.member.voiceChannel;
				musicChannel = message.channel;
				musicQueue = [];
				voiceChannel.join();
				console.log("Joining: " + voiceChannel + ".");
				console.log(" ");
			}
			
			if(voiceChannel && voiceChannel == message.member.voiceChannel) {
				if(getYoutubeID(words[1], {fuzzy: false})) {
					fetchVideoInfo(getYoutubeID(words[1])).then(function (videoInfo) {
						if(videoInfo.duration <= 3600) {
							if(musicQueue.length == 0 && isPlaying == 0) {
								playMusic(words[1]);
								nowMusic = [words[1], videoInfo.title, videoInfo.duration];
								message.channel.send(videoInfo.title + " is now playing in: " + voiceChannel + ".");
								console.log("Now playing: " + videoInfo.title + " in " + voiceChannel + ".");
								console.log(" ");
							} else {
								musicQueue.push(words[1], videoInfo.title, videoInfo.duration);
								message.reply(videoInfo.title + " has been added to the queue.");
							}
						} else {
							message.reply("I can't play videos over 1 hour.");
						}
					});
				}
				else if(words[1]) {
					words.shift();
					words = words.join(" ");
					search(words, opts, function(err, results) {
						if(err) return console.log(err);
						for(var k = 0; k<=9; k++) {
							if(results[k].kind == "youtube#video") {
								fetchVideoInfo(results[k].id).then(function (videoInfo) {
									if(videoInfo.duration <= 3600) {
										if(musicQueue.length == 0 && isPlaying == 0) {
											playMusic(results[k].link);
											nowMusic = [results[k].link, videoInfo.title, videoInfo.duration];
											message.channel.send(videoInfo.title + " is now playing in: " + voiceChannel + ".");
											console.log("Now playing: " + videoInfo.title + " in " + voiceChannel + ".");
											console.log(" ");
										} else {
											musicQueue.push([results[k].link, videoInfo.title, videoInfo.duration]);
											message.reply(results[k].title + " has been added to the queue.");
										}
									} else {
										message.reply("I can't play videos over 1 hour.");
									}
								});
								break;
							}
						}
					});
				} else {
					message.reply("usage !play <Youtube URL/Search Query>");
				}
			}
		}
		else {
			message.author.send("Invalid command, please use !help in a chat room to see my commands!");
			message.delete();
		}
	}
});

bot.login(token);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function playMusic(ytlink) {
	dispatcher = voiceChannel.connection.playStream(ytdl(ytlink, {filter: "audioonly"}));
	isPlaying = 1;
	
	dispatcher.on("end", function() {
		if(musicQueue.length != 0) {
			if(musicQueue[0]) {
				var next = musicQueue[0][0];
				nowMusic = musicQueue[0];
				console.log("Now playing: " + musicQueue[0][1] + " in " + voiceChannel + ".");
				console.log(" ");
				musicChannel.send(musicQueue[0][1] + " is now playing in " + voiceChannel + ".");
				musicQueue.shift();
				playMusic(next);
			}
		} else {
			musicQueue = [];
			isPlaying = 0;
		}
	});
}