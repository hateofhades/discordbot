const fs = require('fs');
const http = require('http');
console.log("Downloading files...");

if (fs.existsSync("champion.json")) {
    console.log("Deleting older files before downloading...");
    fs.unlinkSync("champion.json");
}

const file = fs.createWriteStream("champion.json");

const request = http.get("http://ddragon.leagueoflegends.com/cdn/10.11.1/data/en_US/champion.json", function(response) {
    response.pipe(file);
    file.on('finish', function() {
        file.close();
        console.log("Download complete.")
    });
}).on('error', function(err) {
    fs.unlinkSync("champion.json");
    console.error("Download failed");
});