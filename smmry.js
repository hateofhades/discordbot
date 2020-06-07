const config = require('./config.json');
const Discord = require('discord.js');
const request = require('request-promise');
var validUrl = require('valid-url');


module.exports = {
    get: function(message, url) {
        if (validUrl.isUri(url))
            summary(url, message, function(embed) {
                message.channel.send({ embed });
                console.log(message.author.username + " called summary on: " + url);
            });
    }
};

function summary(url, message, callback) {
    request("https://api.smmry.com?SM_KEYWORD_COUNT=3&SM_API_KEY=" + config.smmry + "&SM_URL=" + url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            var embed;

            if (json != null) {
                var keywords = json.sm_api_keyword_array;
                keywords = keywords.join(", ");
                embed = new Discord.MessageEmbed()
                    .setTitle(json.sm_api_title > 256 ? json.sm_api_title.slice(0, 256) : json.sm_api_title)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setURL(url)
                    .setFooter("Reduced character count: " + json.sm_api_character_count + " | Reduced: " + json.sm_api_content_reduced + " | Keywords: " + keywords);

                var text = json.sm_api_content;
                text = text.split(". ");

                for (let i = 0; i < text.length - 1; i++) {
                    embed.addField("\u200b", text[i] + ".", false);
                }

                callback(embed);
            } else { //handle error
                embed = new Discord.MessageEmbed()
                    .setTitle("Error")
                    .addField("Something bad happend", "An error occured!", true);

                callback(embed);
            }
        } else {
            embed = new Discord.MessageEmbed()
                .setTitle("ERROR")
                .addField("ERROR", response.statusCode, true);
        } //handle error
    });
}
