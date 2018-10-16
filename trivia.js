const request = require('request-promise');
const Entities = require('html-entities').XmlEntities;
const fs = require('fs');

const entities = new Entities();

module.exports = {
  trivia: function(callback) {
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
  },
  
  check_answer: function(answer) {
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
};


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}