var debug = false;

// grab the keys
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var moment = require("moment");
var fs = require('fs');

// if (debug) console.log (keys);

switch (process.argv[2]) {
	case 'my-tweets':
		displayTweets();
		break;
	case 'spotify-this-song':
		spotifySong();
		break;
	case 'movie-this':
		movieDetails();
		break;
	case 'do-what-it-says':
		doIt();
		break;
		
	default:
		console.log("I'm sorry, I don't understand that command! please try again.");
}

// node liri.js my-tweets
function displayTweets() {
	// This will show your last 16 tweets and when they were created at in your terminal/bash window.
	 
	var client = new Twitter(keys.twitterKeys);
	 
	var params = {user_id: 'ChiragsAlias', count: 16};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	   // if (debug) console.log(tweets);
	   for (var i = 0; i < tweets.length; i++) {
	   	console.log("Tweet #"+(i+1) +" -- "+tweets[i].created_at + " -- "+tweets[i].text);
	   }
	  }
	  else {
	  	if (debug) console.log("error",  error);
	  	// if (debug) console.log("response",  response);
	  }
	});
}

// node liri.js spotify-this-song '<song name here>'
function spotifySong() {


// if no song is provided then your program will default to
var song = "the sign";

if(process.argv.length>3 && process.argv[3]) {
	song = process.argv[3];
	if(debug) console.log("song", song);
}

spotify.search({ type: 'track', query: song }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 	else {

 		if(debug) console.log("data", data);

 		if(data.error.status==401) {
 			console.log("This Spotify package is no longer authorized by Spotify's Web API");
		    // Artist(s)
 		}
 		else{

 		// This will show the following information about the song in your terminal/bash window
		// The song's name
		console.log("Song Name:", data.tracks.items[0].name);
		// A preview link of the song from Spotify
		console.log("Song Name:", data.tracks.items[0].preview_url);
		// The album that the song is from
		console.log("Song Name:", data.tracks.items[0].album.name);
		

		
		}
	}
});



}
// node liri.js movie-this '<movie name here>'
function movieDetails() {

var movie = "Mr. Nobody";

if(process.argv.length>3 && process.argv[3]) {
	movie = process.argv[3];
	if(debug) console.log("movie", movie);
}

var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

if(debug) console.log(queryUrl);

request(queryUrl, (error, response, body)=>{

	if(!error && response.statusCode === 200 )
	{
		var bodyObj = JSON.parse(body)
		//console.log(body);
		// if (debug) console.log(bodyObj);
		console.log("Title:", bodyObj.Title);
		console.log("Released:", bodyObj.Released);
		console.log(moment(new Date(bodyObj.Released)).format("YYYY"));
		console.log("IMDB rating:", bodyObj.imdbRating);
		console.log("Country:", bodyObj.Country);
		console.log("Language:", bodyObj.Language);
		console.log("Plot:", bodyObj.Plot);
		console.log("Actors:", bodyObj.Actors);
		
		
	}
});
// This will output the following information to your terminal/bash window:

//   * Title of the movie.
//   * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.
//   * Rotten Tomatoes URL.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
// It's on Netflix!

}

// node liri.js do-what-it-says
function doIt(){
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
//read bank file
	fs.readFile("random.txt", "utf8", function(error, data){
		//call back function once file is read

		//if error, console log it and return
		if(error) return console.log(error);

		//otherwise process instructions (#'s) in file
		else {

			//console.log("DEBUG", data);
			//split string of numbers by ", " to remove extra space and add to array
			var instructions = data.split(",");
			if(debug) console.log ("instructions", instructions);

			if (instructions.length>1) process.argv[3] = instructions[1];

			switch (instructions[0]) {
				case 'my-tweets':
					displayTweets();
					break;
				case 'spotify-this-song':
					spotifySong();
					break;
				case 'movie-this':
					movieDetails();
					break;
				default:
					console.log("I'm sorry, I don't understand that command! please try again.");
			}
		
		}
	});
}