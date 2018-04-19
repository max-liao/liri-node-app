//Requires
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var request = require('request');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var twitter = function() {
    client.get('statuses/user_timeline',{ screen_name: 'Bobmax75999205'} , function(error, tweets, response) {
    if (!error){
        var tweetslen = tweets.length;
        for (i=0; i< 20 || i<tweets.length; i++){
            if (tweets[i]){
                console.log("\nTweet #" +(i+1));
                console.log("created at: " + tweets[i].created_at);
                console.log(tweets[i].text);
            }
        }        
    } else {
        // console.log(error);
        throw error;
    }
    });
}
    
var spotifythissong = function(song) {
    if (song == undefined) {
        song = "The Sign, Ace of Base";
      }

    spotify.search(
    {
      type: "track",
      query: song,
      limit: 1
    }, function(error, data) {
        if (!error){
            var songs = data.tracks.items;
            var artists = [];
            var artistslen = songs[0].artists.length;
            for (j = 0; j<artistslen; j++){
                artists.push(songs[0].artists[j].name);
            }
            console.log("\nSearch: " + song);
            console.log("Song Name: " + songs[0].name);
            console.log("Artist(s): " + artists);
            console.log("Album: " + songs[0].album.name);
            console.log("Preview Link: " + songs[0].preview_url);
        } else {
            throw error;
        }
    }
  );
};
 
var omdb = function(movieName) {

    if (movieName == undefined){
        movieName = "Mr. Nobody";
    }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    
    if (!error){
      var body = JSON.parse(body);
      console.log("\nTitle: " + body.Title);
      console.log("\nActors: " + body.Actors);
      console.log("Year: " + body.Year + "; MPAA Rating: " + body.Rated);
      console.log("IMDB: " + body.imdbRating + "; Rotten Tomatoes: " + body.Ratings[0].Value);
      console.log("Country(s) of Production: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("\nPlot: " + body.Plot);
    }
  });
};

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var txtdata = data.split(",");
    var txtlength = txtdata.length;

    if (txtlength === 2) {
      readinput(txtdata[0], txtdata[1]);
    }
    else if (txtlength === 1) {
      readinput(txtdata[0]);
    }
  });
};


var readinput = function(command, value) {
    switch (command) {
    case "my-tweets":
      twitter();
      break;
    case "spotify-this-song":
      spotifythissong(value);
      break;
    case "movie-this":
      omdb(value);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("Incorrect input");
    }
  };

  function log() {

    // We will add the value to the bank file.
    fs.appendFile("bank.txt", ", " + value, function(err) {
      if (err) {
        return console.log(err);
      }
    });
  
    // We will then print the value that was added (but we wont print the total).
    console.log("Deposited " + value + ".");
  }
  
// Read and process user input
readinput(process.argv[2],process.argv[3]);
