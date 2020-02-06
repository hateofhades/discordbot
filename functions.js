const Discord = require('discord.js');
const jimp = require('jimp');
const request = require('request-promise');
const parseString = require('xml2js').parseString;
const fs = require('fs');
const Random = require("random-js");
const random = new Random(Random.engines.mt19937().autoSeed());

module.exports = {
  sendHelpMessage: function (user) {
    sendHelpMessage(user);
  },
  secondsToMinutes: function (seconds) {
    return secondsToMinutes(seconds);
  },
  quoteMessage: function (channel, quoted, words) {
	  quoteMessage(channel, quoted, words);
  },
  requestImage: function (what, message) {
	  requestImage(what, message);
  },
  getRandomTeam: function (message) {
	  getRandomTeam(message);
  }
};

function getRandomTeam(message) {
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
								 .setThumbnail("http://ddragon.leagueoflegends.com/cdn/10.3.1/img/champion/" + json.data[Object.keys(json.data)[value]].id + ".png");
		
		message.channel.send({embed});
	}
}

function requestImage(what, message) {
	if(what == "cat") {
		request("http://thecatapi.com/api/images/get?format=xml&type=gif", function (error, response, body) {
				
			parseString(body, function(err, result) {
				
			var json = JSON.parse(JSON.stringify(result));
				
			const embed = new Discord.RichEmbed()
									 .setImage(json.response.data[0].images[0].image[0].url[0]);
				
			message.channel.send({embed});
			
			});
		});
	} else if (what == "dog") {
		request("https://api.thedogapi.com/v1/images/search?format=json&mime_types=gif", function (error, response, body) {
				
			var json = JSON.parse(body);
		
			const embed = new Discord.RichEmbed()
									 .setImage(json[0].url);
				
			message.channel.send({embed});
		});
	}
}

function quoteMessage(channel, quoted, words) {
	words.splice(0, 2);

	const embed = new Discord.RichEmbed()
		.setAuthor(quoted.username, quoted.avatarURL)
		.setColor(0xFF00FF)
		.setDescription(words.join(" "));
				
	channel.send({embed});
}

function sendHelpMessage(user) {
	user.send({embed: {
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
	}});
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