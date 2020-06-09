const fs = require('fs');
const ytdl = require('ytdl-core');
const getYouTubeID = require('get-youtube-id');
const Discord = require('discord.js');

const config = require('./config.json');

const {google} = require('googleapis');
const youtube = google.youtube({
   version: 'v3',
   auth: config.youtube
});

var channel = null;
var channelVoice = null;
var dispatcher = null;
var volume = 0.5;
var totalQueue = 0;
var search = [];
var searchMessage;
var queue = [];
var playing = 0;
var searched = 0;
var playingTitle = "";
var botUser = null;
var currentTime = 0;
var totalTime = 0;

/*setInterval(function () {
	if(playing) {
		currentTime++;
		botUser.setActivity(playingTitle + " - " + secondsToDuration(currentTime) + "/" + totalTime);
	} else {
		if(botUser != null)
			botUser.setActivity("!help");
	}
}, 1000);*/

module.exports = {
  join : function (message) {
	if(message.member.voice.channel && channel == null) {
		channel = message.member.voice.channel;
		
		channel.join()
		      .then(connection => channelVoice = connection)
		      .catch(console.error);
		
		console.log("I have joined voice channel: " + channel.name + ". Requested by: " + message.author.username + ".");
	} else if(channel != null) {
		message.reply("I'm already in already connected to a voice channel. You can find me in: " + channel.name + ".");
	} else {
		message.reply("you are not in a voice channel!");
	}
  },
  leave : function (message) {
	var voice = message.member.voice.channel;
	if(channel == null) {
		message.reply("I'm not in a voice channel!");
	} else if(channel && channel == voice) {
		console.log("I have left voice channel: " + channel.name + ". Requested by: " + message.author.username + ".");
		
		leave();
	} else if(channel != voice) {
		message.reply("you are not currently in the same voice channel as me. You can find me in: " + channel.name + ".");
	}
  },
  volume : function (message, words) {
	if(words[1] != null) {
		if(!isNaN(words[1])) {
			if(words[1] >= 0 && words[1] <= 100) {
				volume = words[1] / 100;
				if(dispatcher != null)
					dispatcher.setVolume(volume);
			}
		} else {
			message.reply("usage !volume <0-100>");
		}
	} else {
		message.reply("usage !volume <0-100>");
	}		
  },
  clearQueue : function (message) {
	queue = [];
	totalQueue = 0;  
  },
  skip : function (message) {
	if(playing) {
		if(channel = message.member.voice.channel) {
			
			message.reply("Skipped: " + playingTitle);
			console.log("Skipped " + playingTitle + ". Requested by: " + message.author.username);
			
			dispatcher.end();
		} else {
			message.reply("we're not in the same channel! You can find me in: " + channel.name);
		}		
	} else {
		message.reply("I'm not playing anything!");
	}
  },
  queue : function (message, words) {
	if(!isNaN(words[1]) || words[1] == null) {
		if(words[1] == null) words[1] = 1;
		if(queue.length == 0) {
			message.reply("queue is empty!");
		} else if((words[1] - 1) * 5 < queue.length) {
			var embeded = new Discord.MessageEmbed().setTitle("Queue " + words[1] + "/" + (Math.floor((queue.length - 1) / 5) + 1) + " | Total Queue Time: " + secondsToDuration(totalQueue));
			if(words[1] < Math.floor(queue.length / 5) + 1)
				for(var i = 5 * (words[1] - 1); i <= 5 * (words[1] - 1) + 4; i++) {
					embeded.addField((i + 1) + ". " + queue[i][1], "Duration: " + queue[i][2] + " | Views: " + queue[i][3]);
				}
			else
				for(var i = 5 * (words[1] - 1); i <= queue.length - 1; i++) {
					embeded.addField((i + 1) + ". " + queue[i][1], "Duration: " + queue[i][2] + " | Views: " + queue[i][3]);
				}
			message.channel.send(embeded);
		} else {
			message.reply("there only are " + (Math.floor((queue.length - 1) / 5) + 1) + " page(s).");
		}
	} else {
		message.reply("usage: !queue (page-number)");
	}
  },
  setChannel : function (chan) {
	channel = chan;
	console.log("I have been moved to channel: " + channel.name);
  },
  setBot : function (bot) {
	botUser = bot;  
  },
  closeChannel : function () {
	if(channel != null) {
		console.log("I have left voice channel: " + channel.name + ". I was disconnected.");
		
		leave();
	}
	channel = null;
  },
  play : function (message, words) {
	if(channel == null && message.member.voice.channel != null) {
		channel = message.member.voice.channel;
		channel.join()
		      .then(connection => channelVoice = connection)
		      .catch(console.error);
		
		console.log("I have joined voice channel: " + channel.name + ". Requested by: " + message.author.username + ".");
		
		searchOrAdd(message, words);
	} else if(channel == null && message.member.voice.channel == null) {
		message.reply("you're not in a voice channel!");
	} else if(channel == message.member.voice.channel) {
		searchOrAdd(message, words);
	} else if(channel != message.member.voice.channel) {
		message.reply("you can't add music to the queue, we're not in the same voice channel! You can find me in: " + channel.name + ".");
	}		
  }
};

function searchOrAdd(message, words) {
	if((words[1] == 1 || words[1] == 2 || words[1] == 3 || words[1] == 4 || words[1] == 5) && search.length != 0 && searched != 0) {
		queue.push(search[words[1] - 1]);
		searched = 0;
		
		if(searchMessage != null) {
			searchMessage.delete();
			searchMessage = null;
		}
		
		if(totalQueue != 0) {
			message.reply("added " + search[words[1] - 1][1] + " to the queue. Time until playing: " + secondsToDuration(totalQueue)).then(message => message.delete(totalQueue * 1000));
			console.log("Added " + search[words[1] - 1][1] + " to the queue. Requested by: " + message.author.username);
		}
		
		totalQueue += Number(durationToSeconds(search[words[1] - 1][2]));
		
		checkQueue();
		message.delete();
		search = [];
	} else if(getYouTubeID(words[1], {fuzzy: false}) != null) {
		words[1] = words[1].split("?v=");
		
		getDuration(words[1][1], 1, function (title, duration, views) {
			var searched = [];
			searched.push(words[1][1]);
			searched.push(title);
			searched.push(duration);
			searched.push(views);
			searched.push(message);
			
			queue.push(searched);
			
			if(totalQueue != 0) {
				message.reply("added " + title + " to the queue. Time until playing: " + secondsToDuration(totalQueue)).then(message => message.delete(totalQueue * 1000));
				console.log("Added " + title + " to the queue. Requested by: " + message.author.username);
			}
			
			checkQueue();
			message.delete();
			totalQueue += Number(durationToSeconds(duration));
		});
	} else {
		words = words.join(" ");
		words = words.substr(words.indexOf(" ") + 1);
		console.log("Searching YouTube for: " + words + ". Requested by: " + message.author.username);
		if(searchMessage != null) {
			searchMessage.delete();
			searchMessage = null;
		}			
		search = [];
		youtube.search.list({
			part: 'snippet',
			q: words,
			type: "video"
		}, function (err, data) {
			if(err)
				console.error("Error: " + err);
			if(data) {
				createMusicEmbed(data.data.items, words, message, function (embeded) {
					message.channel.send(embeded).then(message => searchMessage = message);
					searched = 1;
					message.delete();
				});
			}
		});
	}
}

function checkQueue() {
	if(playing == 0 && queue.length >= 1) {
		playing = 1;
		console.log("I'm now playing: " + queue[0][1] + ". Requested by: " + queue[0][4].author.username);
		var time = queue[0][2];
		totalTime = time;
		currentTime = 0;
		playingTitle = queue[0][1];
		queue[0][4].reply("I'm now playing " + queue[0][1]);
		playMusic("https://www.youtube.com/watch?v=" + queue[0][0]);
		
		//botUser.setActivity(queue[0][1] + " - 00:00/" + time);
		
		queue.shift();
	}
}

function createMusicEmbed(items, words, message, callback) {
	var i = 1;
	var embeded = new Discord.MessageEmbed().setTitle("Youtube Search: " + words);
	items.forEach(element => {
		getDuration(element.id.videoId, 0, function(duration, views) {
			embeded.addField(i + ". " + element.snippet.title, "Duration: " + duration + " | Views: " + views);
			
			i++;
			
			var searched = [];
			searched.push(element.id.videoId);
			searched.push(element.snippet.title);
			searched.push(duration);
			searched.push(views);
			searched.push(message);
			
			search.push(searched);
			
			if(i == 6)
				callback(embeded);
		});
	});
}

function getDuration(ytid, type, callback) {
	ytdl.getBasicInfo("https://www.youtube.com/watch?v=" + ytid, (err, info) => {
		if (err) throw err;
		if (info && type == 0)
			callback(secondsToDuration(info.player_response.videoDetails.lengthSeconds), formatViews(info.player_response.videoDetails.viewCount));
		else if(info && type == 1)
			callback(info.player_response.videoDetails.title, secondsToDuration(info.player_response.videoDetails.lengthSeconds), formatViews(info.player_response.videoDetails.viewCount));
	});
}

function secondsToDuration(seconds) {
	var minutes = Math.floor(seconds/60);
	seconds = seconds - minutes * 60;
	
	if(minutes >= 10 && seconds >= 10)
		return duration = minutes + ":" + seconds;
	else if(minutes < 10 && seconds >= 10)
		return duration = "0" + minutes + ":" + seconds;
	else if(minutes >= 10 && seconds < 10)
		return duration = minutes + ":0" + seconds;
	else
		return duration = "0" + minutes + ":0" + seconds;
}

function durationToSeconds(duration) {
	var duration = duration.split(":");
	
	return seconds = Number(duration[0]) * 60 + Number(duration[1]);
}

function formatViews(views) {
	if(views < 1000)
		return views;
	else {
		views = views.toString();
		
		var j = 1;
		var newViews = "";
		
		for(var i = views.length - 1; i >= 0; i--) {
			newViews = "" + views[i] + newViews;
			if(j%3 == 0 && i != 0) {
				newViews = "." + newViews;
				j = 0;
			}
			j++;
		}
		
		return newViews;
	}
}

function playMusic(ytlink) {
	dispatcher = channelVoice.play(ytdl(ytlink, {filter: "audioonly"}));
	dispatcher.setVolume(volume);
	
	dispatcher.on("finish", function () {
		playing = 0;
		checkQueue();
	});
}

function leave() {
	playing = 0;
	queue = [];
	totalQueue = 0;
	search = [];
	
	if(channel != null)
		channel.leave();
	if(dispatcher != null)
		dispatcher.end();
	
	dispatcher = null;
	channel = null;
}
