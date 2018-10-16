const Discord = require('discord.js');
const bot = new Discord.Client();
const parseString = require('xml2js').parseString;
const fs = require('fs');
const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());
const jimp = require('jimp');
const search = require('youtube-search');
const request = require('request-promise');
const token = "";
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const lowerCase = require('lower-case');
const ytdl = require('ytdl-core');

var opts = {
  maxResults: 10,
  key: ''
};

var voiceChannel;
var musicChannel;
var nowMusic;
var musicQueue = [];
var dispatcher;
var isPlaying = 0;

const trivia = require("./trivia.js");

var triviaon = 0;

bot.on('ready', () => {
	console.log("Bot is now online.");
	bot.user.setActivity('!help');
});

bot.on('message', message => {
	if(message.author.bot) return;
	
	if(message.content.indexOf('!') === 0) {
		var text = message.content.substring(1);
		var words = text.split(" ");

		if(words[0] == "help") {
			message.author.send({embed: {
					color: 3447003,
					fields: [{
						name: "Subreddits",
						value: "!meme !4chan !blacktwitter !dank !facepalm !meirl !memeeconomy !wholesome !deep !niceguys !nicegirls !leaguememe !lwiay !loop !hmmm !woooosh !pcmr !fellowkids"
					}, 
					{
						name: "Music Player",
						value: "!join !leave !volume <0 - 100> !play !queue"
					},
					{
						name: "Memegenerator",
						value: "!scroll !warning !buttons !slap !achievement"
					},
					{
						name: "Fun",
						value: "!quote !chucknorris !ask !cat !dog"
					},
					{
						name: "Trivia",
						value: "!trivia !answer <a|b|c|d>"
					},
					{
						name: "Utilities",
						value: "!team"
					}]
				}
			});
			message.delete();
		} else if(words[0] == "quote") {
			if(words[1] != null && words[2] != null && message.mentions.everyone == false && message.mentions.users.first() != null) {
				var quoted = message.mentions.users.first();
				
				words.splice(0, 2);
				
				const embed = new Discord.RichEmbed()
					.setAuthor(quoted.username, quoted.avatarURL)
					.setColor(0xFF00FF)
					.setDescription(words.join(" "));
				
				message.channel.send({embed});
			} else {
				message.reply("Usage: !quote [@User] [Message]");
			}
		} else if(words[0] == "scroll") {
			if(words[1] != null) {	
				words.splice(0, 1);
				
				words = words.join(" ");
				
				if(words.length > 112)
					words = words.replace(words.substring(112 , words.length), "");
				
				words = chunk(words, 14);
				
				img("scroll", words, 100, 290, 0, 12, function(result) {
					if(result) {
						message.channel.send({file: "memes/scroll.png"});
					} else {
						message.reply("Sorry, there was an error. Please retry!");
					}
				});
			} else
				message.reply("Usage: !scroll [text]");
		} else if(words[0] == "warning") {
			if(words[1] != null) {	
				words.splice(0, 1);
				
				words = words.join(" ");
				
				if(words.length > 108)
					words = words.replace(words.substring(108 , words.length), "");
				
				words = chunk(words, 18);
				
				img("warning", words, 25, 130, 0, 33, function(result) {
					if(result) {
						message.channel.send({file: "memes/warning.png"});
					} else {
						message.reply("Sorry, there was an error. Please retry!");
					}
				});
			} else
				message.reply("Usage: !warning [text]");
		} else if(words[0] == "buttons") {
			words.splice(0, 1);
			
			words = words.join(" ");
			words = words.split(",");
			
			if(words[0] != null && words.length == 2) {
				var type = [[90, 130, 28], [300, 90, 28]];
				
				if(words[0].length > 56)
					words[0] = words[0].replace(words[0].substring(56, words[0].length), "");
				if(words[1].length > 56)
					words[1] = words[1].replace(words[1].substring(56, words[1].length), "");
				
				
				img("buttons", words, 0, 0, type, 16, function(result) {
					if(result) {
						message.channel.send({file: "memes/buttons.png"});
					} else {
						message.reply("Sorry, there was an error. Please retry!");					
					}
				});
			} else 
				message.reply("Usage: !buttons [Button 1 Text], [Button 2 Text]");
		} else if(words[0] == "slap") {
			words.splice(0, 1);
			
			words = words.join(" ");
			words = words.split(",");
			
			if(words[0] != null && words.length == 2) {
				var type = [[10, 10, 32], [224, 10, 32]];
				
				if(words[0].length > 160)
					words[0] = words[0].replace(words[0].substring(160, words[0].length), "");
				if(words[1].length > 160)
					words[1] = words[1].replace(words[1].substring(160, words[1].length), "");
				
				
				img("slap", words, 0, 0, type, 12, function(result) {
					if(result) {
						message.channel.send({file: "memes/slap.png"});
					} else {
						message.reply("Sorry, there was an error. Please retry!");					
					}
				});
			} else 
				message.reply("Usage: !slap [Robin Text], [Batman Text]");
		} else if(words[0] == "achievement") {
			words.splice(0, 1);
			
			words = words.join(" ");
			words = words.split(",");
			
			if(words[0] != null && words.length == 2) {
				
				if(words[0].length > 18)
					words[0] = words[0].replace(words[0].substring(18, words[0].length), "");
				if(words[1].length > 25)
					words[1] = words[1].replace(words[1].substring(25, words[1].length), "");
				
				console.log(words[0].substring(-1, 1));
				
				words[0] = words[0].replace(" ", "%20");
				words[1] = words[1].replace(" ", "%20");
				
				const embed = new Discord.RichEmbed()
										 .setImage("https://www.minecraftskinstealer.com/achievement/a.php?i=2&h=" + words[0] + "&t=" + words[1]);
				
				message.channel.send({embed});
				
			} else 
				message.reply("Usage: !achievement [Title], [Text]");
		} else if(words[0] == "chucknorris") {
			request("https://geek-jokes.sameerkumar.website/api", function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);
					
					message.channel.send(json);
				}
			});
		} else if(words[0] == "ask") {
			if(words[1] != null)
				request("https://yesno.wtf/api", function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var json = JSON.parse(body);
						
						words.splice(0, 1);
						
						const embed = new Discord.RichEmbed()
												 .addField(message.author.username + ":" , words.join(" "))
												 .setColor(0xFF00FF)
												 .addField("Answer:", capitalizeFirstLetter(json.answer) + ".")
												 .setThumbnail(json.image);
						
						message.channel.send({embed});
					}
				});
			else
				message.reply("Usage: !ask [Yes/No question]");
		} else if(words[0] == "cat") {
			request("http://thecatapi.com/api/images/get?format=xml&type=gif", function (error, response, body) {
				
				parseString(body, function(err, result) {
				
					var json = JSON.parse(JSON.stringify(result));
				
					const embed = new Discord.RichEmbed()
											 .setImage(json.response.data[0].images[0].image[0].url[0]);
				
					message.channel.send({embed});
			
				});
			});
			
		} else if(words[0] == "dog") {
			request("https://api.thedogapi.com/v1/images/search?format=json&mime_types=gif", function (error, response, body) {
				
				var json = JSON.parse(body);
				
				const embed = new Discord.RichEmbed()
										 .setImage(json[0].url);
				
				message.channel.send({embed});
			});
			
		} else if(words[0] == "team") {
			var json = JSON.parse(fs.readFileSync('champion.json', 'utf8'));
			
			for(var i = 0; i < 5; i++) {
				var rol = "Top";
				
				if(i == 1)
					rol = "Jungle";
				else if(i == 2)
					rol = "Middle";
				else if(i == 3)
					rol = "ADC";
				else if(i == 4)
					rol = "Support";
				
				var value = random.integer(0, Object.keys(json.data).length - 1);	
				
				const embed = new Discord.RichEmbed()
										 .setTitle(json.data[Object.keys(json.data)[value]].name + " - " + rol)
										 .setThumbnail("http://ddragon.leagueoflegends.com/cdn/8.15.1/img/champion/" + json.data[Object.keys(json.data)[value]].id + ".png");
				
				message.channel.send({embed});
			}
		} else if(words[0] == "meme") {
			reddit("memes", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "4chan") {
			reddit("greentext", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "blacktwitter") {
			reddit("BlackPeopleTwitter", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "dank") {
			reddit("dankmemes", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "facepalm") {
			reddit("facepalm", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "meirl") {
			reddit("me_irl", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "memeeconomy") {
			reddit("memeeconomy", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "wholesome") {
			reddit("wholesomememes", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "deep") {
			reddit("im14andthisisdeep", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "niceguys") {
			reddit("niceguys", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "nicegirls") {
			reddit("nicegirls", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "leaguememe") {
			reddit("leagueofmemes", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "lwiay") {
			reddit("PewdiepieSubmissions", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "loop") {
			reddit("perfectloops", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "hmmm") {
			reddit("hmmm", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "woooosh") {
			reddit("woooosh", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "pcmr") {
			reddit("pcmasterrace", function(embed) {
				message.channel.send({embed});
			});
		} else if(words[0] == "fellowkids") {
			reddit("fellowkids", function(embed) {
				message.channel.send({embed});
			});
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
					queueText = queueText + (k+1) + ". " + musicQueue[k][1] + " [" + secondsToMinutes(musicQueue[k][2]) + "]" + "\n";
					if(k == 9 && musicQueue.length > 10) {
						queueText = queueText + "... and " + (musicQueue.length - 10) + " other songs.";
						break;
					}
				}
				
				message.channel.send({embed: {
					title: "Music Queue",
					fields: [{
						name: "Now Playing:",
						value: nowMusic[1] + " [" + secondsToMinutes(Math.floor(dispatcher.time/1000)) + "/" + secondsToMinutes(nowMusic[2]) + "]"
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

function reddit(sub, callback) {
	request("https://reddit.com/r/" + sub + "/random.json", function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var embed;
			
			if(json[0].data.children[0].data.url != null) {
				if(json[0].data.children[0].data.title.length < 256) {
					embed = new Discord.RichEmbed()
						.setTitle(json[0].data.children[0].data.title)
						.setURL("https://reddit.com" + json[0].data.children[0].data.permalink)
						.setImage(json[0].data.children[0].data.url)
						.setFooter("👍 " + json[0].data.children[0].data.score + " | 💬 " + json[0].data.children[0].data.num_comments + " | By " + json[0].data.children[0].data.author + " on " + json[0].data.children[0].data.subreddit_name_prefixed);
				} else {
					embed = new Discord.RichEmbed()
						.setTitle("Title too long.")
						.setURL("https://reddit.com" + json[0].data.children[0].data.permalink)
						.setImage(json[0].data.children[0].data.url)
						.setFooter("👍 " + json[0].data.children[0].data.score + " | 💬 " + json[0].data.children[0].data.num_comments + " | By " + json[0].data.children[0].data.author + " on " + json[0].data.children[0].data.subreddit_name_prefixed);
				}
				callback(embed);
			} else reddit(sub, callback);	
		}
	});
}

function img(imag, texted, posX, posY, type, fonted, callback) {
		var loadedImage;
		jimp.read('stocks/' + imag + '.png')
			.then(function (image) {
				loadedImage = image;
				
				if(fonted == 16)
					return jimp.loadFont(jimp.FONT_SANS_16_BLACK);
				else if(fonted == 12)
					return jimp.loadFont(jimp.FONT_SANS_12_BLACK);
				else if(fonted == 17)
					return jimp.loadFont(jimp.FONT_SANS_16_WHITE);
				else if(fonted == 33)
					return jimp.loadFont(jimp.FONT_SANS_32_WHITE);
			})
			.then(function (font) {
				
				if(type == 0)
					for(var i = 0; i < texted.length; i++)
						loadedImage.print(font, posX, posY + (i * (fonted + 2)), texted[i]);
				else {
					for(var i = 0; i < type.length; i++) {
						texted[i] = chunk(texted[i], type[i][2]);

						for(var j = 0; j < texted[i].length; j++)
							loadedImage.print(font, type[i][0], type[i][1] + (fonted + 2) * j, texted[i][j]);
					}
				}
				
				loadedImage.write("memes/" + imag + ".png");
						   
				callback(1);
			})
			.catch(function (err) {
				console.log(err);
				callback(0);
			});
}

function chunk(str, n) {
    var ret = [];
    var i;
    var len;

    for(i = 0, len = str.length; i < len; i += n) {
       ret.push(str.substr(i, n))
    }

    return ret
};

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

function secondsToMinutes(seconds) {
	var minutes = 0;
	while(seconds >= 60) {
		minutes++;
		seconds -= 60;
	}
	
	if(seconds < 10)
		seconds = "0" + seconds;
	
	return minutes + ":" + seconds;
}