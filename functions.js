const Discord = require('discord.js');
const request = require('request-promise');
const parseString = require('xml2js').parseString;
const fs = require('fs');

module.exports = {
    sendHelpMessage: function(user) {
        sendHelpMessage(user);
    },
    secondsToMinutes: function(seconds) {
        return secondsToMinutes(seconds);
    },
    quoteMessage: function(channel, quoted, words) {
        quoteMessage(channel, quoted, words);
    },
    requestImage: function(what, message, test = 0) {
        requestImage(what, message, test);
    },
    getRandomTeam: function(message, test = 0) {
        getRandomTeam(message, test);
    }
};

function getRandomTeam(message, test) {
    var json = JSON.parse(fs.readFileSync('champion.json', 'utf8'));

    for (var i = 0; i < 5; i++) {
        var rol = "Top";

        if (i == 1)
            rol = "Jungle";
        else if (i == 2)
            rol = "Middle";
        else if (i == 3)
            rol = "ADC";
        else if (i == 4)
            rol = "Support";

        var value = Math.floor(Math.random() * Object.keys(json.data).length);

        const embed = new Discord.MessageEmbed()
            .setTitle(json.data[Object.keys(json.data)[value]].name + " - " + rol)
            .setThumbnail("http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/" + json.data[Object.keys(json.data)[value]].id + ".png");

        if (!test)
            message.channel.send({ embed });
        else
            return embed;
    }
}

function requestImage(what, message, test) {
    if (what == "cat") {
        request("http://thecatapi.com/api/images/get?format=xml&type=gif", function(error, response, body) {

            parseString(body, function(err, result) {

                var json = JSON.parse(JSON.stringify(result));

                const embed = new Discord.MessageEmbed()
                    .setImage(json.response.data[0].images[0].image[0].url[0]);

                if (!test)
                    message.channel.send({ embed });
                else
                    return embed;

            });
        });
    } else if (what == "dog") {
        request("https://api.thedogapi.com/v1/images/search?format=json&mime_types=gif", function(error, response, body) {

            var json = JSON.parse(body);

            const embed = new Discord.MessageEmbed()
                .setImage(json[0].url);

            if (!test)
                message.channel.send({ embed });
            else
                return embed;
        });
    }
}

function quoteMessage(channel, quoted, words) {
    words.splice(0, 2);

    const embed = new Discord.MessageEmbed()
        .setAuthor(quoted.username, quoted.avatarURL)
        .setColor(0xFF00FF)
        .setDescription(words.join(" "));

    channel.send({ embed });
}

function sendHelpMessage(user) {
    user.send({
        embed: {
            color: 3447003,
            fields: [{
                    name: "Subreddits",
                    value: "!meme !4chan !dank !facepalm !meirl !memeeconomy !wholesome !deep !niceguys !nicegirls !leaguememe !lwiay !loop !hmmm !woooosh !fellowkids !pics"
                },
                {
                    name: "Music Player",
                    value: "!join !leave !volume <0 - 100> !play !queue"
                },
                {
                    name: "Fun",
                    value: "!quote !cat !dog"
                },
                {
                    name: "Trivia",
                    value: "!trivia !answer <a|b|c|d>"
                },
                {
                    name: "Utilities",
                    value: "!team !summarize <url> !summary <url>"
                }
            ]
        }
    });
}

function secondsToMinutes(seconds) {
    var minutes = 0;
    while (seconds >= 60) {
        minutes++;
        seconds -= 60;
    }

    if (seconds < 10)
        seconds = "0" + seconds;

    return minutes + ":" + seconds;
}
