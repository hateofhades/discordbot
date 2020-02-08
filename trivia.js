const request = require('request-promise');
const Entities = require('html-entities').XmlEntities;
const fs = require('fs');

const entities = new Entities();

var triviaon = 0;

module.exports = {
   getTrivia : function (message) {
		if(!triviaon) {
			trivia(function(msg, answer1, answer2, answer3, answer4) {
				message.channel.send(msg);
				message.channel.send("A) " + answer1 + " | B) " + answer2 + " | C) " + answer3 + " | D) " + answer4);
			});
			triviaon = 1;
		} else {
			var json = JSON.parse(fs.readFileSync('trivia.json', 'utf8'));
					
			message.channel.send(json[0]);
			message.channel.send("A) " + json[1] + " | B) " + json[2] + " | C) " + json[3] + " | D) " + json[4]);
		}
   },
   answer : function (message, words) {
		if(triviaon) {
			if(words[1] && (words[1].toLowerCase() == "a" || words[1].toLowerCase() == "b" || words[1].toLowerCase() == "c" || words[1].toLowerCase() == "d")) {
				triviaon = 0;
				var answerr = check_answer(words[1].toLowerCase());
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
   }
};

function trivia(callback) {
	request("https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple", function (error, response, body) {
		var json = JSON.parse(body);
		var question, answer1, answer2, answer3, answer4, corect, alled, mult;
		
		question = entities.decode(json.results[0].question);
		answer1 = entities.decode(json.results[0].incorrect_answers[0]);
		answer2 = entities.decode(json.results[0].incorrect_answers[1]);
		answer3 = entities.decode(json.results[0].incorrect_answers[2]);
		answer4 = entities.decode(json.results[0].correct_answer);
		
		corect = entities.decode(json.results[0].correct_answer);
		
		answers = [answer1, answer2, answer3, answer4];
		answers = shuffle(answers);
		
		answer1 = answers[0];
		answer2 = answers[1];
		answer3 = answers[2];
		answer4 = answers[3];
		
		if(corect == answer1)
			mult = "a";
		else if(corect == answer2)
			mult = "b";
		else if(corect == answer3)
			mult = "c";
		else if(corect == answer4)
			mult = "d";
		
		alled = [question, answer1, answer2, answer3, answer4, mult];
		
		alled = JSON.stringify(alled);
		
		fs.writeFile('trivia.json', alled, 'utf8', (err) => { 
			callback(question, answer1, answer2, answer3, answer4);
		});
	});
}

function check_answer(answer) {
	var json = JSON.parse(fs.readFileSync('trivia.json', 'utf8'));
	if(json[5] == answer) {
		return 1;
	} else {
		var msg;
		if(json[5] == "a")
			msg = "A) " + json[1];
		else if(json[5] == "b")
			msg = "B) " + json[2];
		else if(json[5] == "c")
			msg = "C) " + json[3];
		else if(json[5] == "d")
			msg = "D) " + json[4];
		return msg;
	}
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}