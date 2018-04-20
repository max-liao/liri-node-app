//Requires
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var request = require('request');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var readinput = function(command, value) {
  //console.log("Command:", command);
  //console.log("Song/movie:", value);
  switch (command) {
    case "my-tweets":
      log("my-tweets");
      twitter();
      break;
    case "spotify-this-song":
      log("spotify-this-song " + value);
      spotifythissong(value);
      break;
    case "movie-this":
      log("movie-this " + value);
      omdb(value);
      break;
    case "do-what-it-says":
      log("do-what-it-says");
      doWhatItSays();
      break;
    default:
      console.log("Incorrect input");
  }
};


function log(input) {
  console.log(input);

  // We will add the value to the file.
  fs.appendFile("log.txt", "\n"+ input, function(err) {
    if (err) {
      return console.log(err);
    }
  });
}

var twitter = function() {
    client.get('statuses/user_timeline',{ screen_name: 'Bobmax75999205'} , function(error, tweets, response) {
    if (!error){
        var tweetslen = tweets.length;
        for (i=0; i< 20 || i<tweets.length; i++){
            if (tweets[i]){
                log("\nTweet #" +(i+1));
                log("created at: " + tweets[i].created_at);
                log(tweets[i].text);
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

  //console.log(song);

    spotify.search(
    {
      type: "track",
      query: song,
      limit: 1
    }, function(error, data) {
        if (!error){
            var songs = data.tracks.items;
            if (songs[0].name == undefined){
              log("No such song in Spotify");
            } else {
              var artists = [];
              var artistslen = songs[0].artists.length;
              for (j = 0; j<artistslen; j++){
                  artists.push(songs[0].artists[j].name);
              }
              log("\nSearch: " + song);
              log("Song Name: " + songs[0].name);
              log("Artist(s): " + artists);
              log("Album: " + songs[0].album.name);
              log("Preview Link: " + songs[0].preview_url);
            }
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
  
  //console.log(movieName);

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    
    if (!error){
      var body = JSON.parse(body);
      if (body.Title == undefined){
        log("No such movie in OMDB");
      } else{
        log("\nTitle: " + body.Title);
        log("\nActors: " + body.Actors);
        log("Year: " + body.Year + "; MPAA Rating: " + body.Rated);
        log("IMDB: " + body.imdbRating + "; Rotten Tomatoes: " + body.Ratings[0].Value);
        log("Country(s) of Production: " + body.Country);
        log("Language: " + body.Language);
        log("\nPlot: " + body.Plot);
      }
    } else {
      throw error;
    }
  });
};

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    
    // console.log(data);

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


// Begin liri
readinput(process.argv[2],process.argv[3]);