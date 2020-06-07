const Discord = require('discord.js');
const request = require('request-promise');

module.exports = {
    send: function(message, riddit, test = 0) {
        reddit(riddit, function(embed) {
            if (!test)
                message.channel.send({ embed });
            else return embed;
        });
    }
};

function reddit(sub, callback) {
    request("https://reddit.com/r/" + sub + "/random.json", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            var embed;

            if (json[0].data.children[0].data.url != null) {
                if (json[0].data.children[0].data.title.length < 256) {
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