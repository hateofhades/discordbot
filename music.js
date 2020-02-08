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
var dispatcher = null;
var volume = 100;
var search = [];
var queue = [];

module.exports = {
  join : function (message) {
	if(message.member.voiceChannel && channel == null) {
		channel = message.member.voiceChannel;
		message.member.voiceChannel.join();
		
		console.log("I have joined voice channel: " + channel.name + ". Requested by: " + message.author.username + ".");
	} else if(channel != null) {
		message.reply("I'm already in already connected to a voice channel. You can find me in: " + channel.name + ".");
	} else {
		message.reply("you are not in a voice channel!");
	}
  },
  leave : function (message) {
	var voice = message.member.voiceChannel;
	if(channel && channel == voice) {
		channel.leave();
			
		console.log("I have left voice channel: " + channel.name + ". Requested by: " + message.author.username + ".");
		
		channel = null;
		search = [];
	} else if(channel != voice) {
		message.reply("you are not currently in the same voice channel as me. You can find me in: " + channel.name + ".");
	} else {
		message.reply("I'm not in a voice channel!");
	}
  },
  clearQueue : function (message) {
	  
  }, 
  setChannel : function (chan) {
	channel = chan;
	console.log("I have been moved to channel: " + channel.name);
  },
  closeChannel : function () {
	if(channel != null) {
		channel.leave();
		console.log("I have left voice channel: " + channel.name + ". I was disconnected.");
	}
	channel = null;
  },
  play : function (message, words) {
	if(channel == null && message.member.voiceChannel != null) {
		channel = message.member.voiceChannel;
		channel.join();
		
		console.log("I have joined voice channel: " + channel.name + ". Requested by: " + message.author.username + ".");
		
		searchOrAdd(message, words);
	} else if(channel == null && message.member.voiceChannel == null) {
		message.reply("you're not in a voice channel!");
	} else if(channel == message.member.voiceChannel) {
		searchOrAdd(message, words);
	} else if(channel != message.member.voiceChannel) {
		message.reply("you can't add music to the queue, we're not in the same voice channel! You can find me in: " + channel.name + ".");
	}		
  }
};

function searchOrAdd(message, words) {
	if((words[1] == 1 || words[1] == 2 || words[1] == 3 || words[1] == 4 || words[1] == 5) && search.length != 0) {
		search = [];
		
	} else if(getYouTubeID(words[1], {fuzzy: false}) != null) {
		search = [];
		
	} else {
		words = words.join(" ");
		words = words.substr(words.indexOf(" ") + 1);
		console.log("Searching YouTube for: " + words + ". Requested by: " + message.author.username);
		search = [];
		youtube.search.list({
			part: 'snippet',
			q: words,
			type: "video"
		}, function (err, data) {
			if(err)
				console.error("Error: " + err);
			if(data) {
				createMusicEmbed(data.data.items, words, function (embeded) {
					message.channel.send(embeded);
				});
			}
		});
	}
}

function createMusicEmbed(items, words, callback) {
	var i = 1;
	var embeded = new Discord.RichEmbed().setTitle("Youtube Search: " + words);
	items.forEach(element => {
		search.push(element.id.videoId);
		getDuration(element.id.videoId, function(duration) {
			embeded.addField(i + ". " + element.snippet.title, "Duration: " + duration);
			
			i++;
			
			if(i == 6)
				callback(embeded);
		});
	});
}

function getDuration(ytid, callback) {
	ytdl.getBasicInfo("https://www.youtube.com/watch?v=" + ytid, (err, info) => {
		if (err) throw err;
		if (info) {
			var duration = info.player_response.videoDetails.lengthSeconds;
			var views = info.player_response.videoDetails.viewCount;
			var minutes = Math.floor(duration/60);
			var seconds = duration - minutes * 60;
			
			if(minutes >= 10 && seconds >= 10)
				callback(minutes + ":" + seconds + " | Views: " + formatViews(views));
			else if(minutes < 10 && seconds >= 10)
				callback("0" + minutes + ":" + seconds + " | Views: " + formatViews(views));
			else if(minutes >= 10 && seconds < 10) 
				callback(minutes + ":0" + seconds + " | Views: " + formatViews(views));
			else
				callback("0" + minutes + ":0" + seconds + " | Views: " + formatViews(views));
		}
	});
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
	dispatcher = channel.connection.playStream(ytdl(ytlink, {filter: "audioonly"}));
}