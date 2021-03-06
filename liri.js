var apiKeys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var fs = require('fs');


var inputString = process.argv;

var userInput = inputString[2];
var userSearch = inputString[3];

function userCommand(userInput, userSearch){

	switch (userInput){
		case "my-tweets":
			grabTweets();
			break;
		case "spotify-this-song":
			grabSong();
			break;
		case "movie-this":
			grabMovie();
			break;
		case "do-what-it-says":
			grabLIRI();
			break;
		case "LIRI-test":
			liriTest();
			break;
		default: console.log("Sorry not a command!");
	}
}

function showSong(track){
	console.log(track.artists[0].name);
	console.log(track.name);
	console.log(track.preview_url);
	console.log(track.album.name);
	// appendLog(track.artists[0].name);
	// appendLog(track.name);
	// appendLog(track.preview_url);
	// appendLog(track.album.name);
	var songLog ={
		Artist: track.artists[0].name,
		Name: track.name,
		PreviewURL: track.preview_url,
		Album: track.album.name
	}
	appendLog(JSON.stringify(songLog));
}

function appendLog(data){
	fs.appendFile('log.txt', data + '\n', function(err){
		if (err){
			console.log(err);
		}else{
			console.log("Log Updated");
		}
	})
}

function grabTweets(){

	var client = new Twitter(
		apiKeys.twitterKeys
	);

	var params = {
		screen_name: 'Wintermute1',
		count: 20
	};

		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  	
		  	if (!error) {
		    	for (i=0; i<tweets.length; i++){
		    		console.log(i + " " + tweets[i].text + " Time Created: " + tweets[i].created_at);
		    		// appendLog(i + " " + tweets[i].text + " Time Created: " + tweets[i].created_at);
		    		var twitterLog ={
		    				tweetNumber: i,
		    				tweetText: tweets[i].text,
		    				tweetTime: tweets[i].created_at
		    		}
		    		appendLog(JSON.stringify(twitterLog));		    		    		
		    	}
		  	}else{
		  		return console.log("Error!");
		  		}
			});
}

function grabSong(){

	spotify.search({ type: 'track', query: userSearch }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    	}else{
	    	for(i=0; i<data.tracks.items.length; i++){
	    		var track = data.tracks.items[i];
	    		if (track.name.toLowerCase() === userSearch.toLowerCase()){
	    			showSong(track);
	    			return;
	    		}
	    	}
		 	spotify.search({ type: 'track', query: "The Sign" }, function(err, data) {
		    		if ( err ) {
		        		console.log('Error occurred: ' + err);
		        		return;
		    		}else{
		    			for(i=0; i<data.tracks.items.length; i++){
		    				var track = data.tracks.items[i];
							if (track.name.toLowerCase() === "The Sign".toLowerCase()){
								showSong(track);
								return;
							}
		    			}
		    		}
		    });
		}
	});
}

function grabMovie(){
	var queryURL = ('http://www.omdbapi.com/?t=' + userSearch + '&y=&plot=short&r=json&tomatoes=true');

	var params = {
		uri: queryURL,
		json: true
	};
		request(params, function (error, response, body) {
	  		if (!error && response.statusCode == 200) {
	  			console.log("Title: " + body.Title);
	    		console.log("Year: " + body.Year);
	    		console.log("IMDB Rating: " + body.imdbRating);
	    		console.log("Country: " + body.Country);
	    		console.log("Plot: " + body.Plot);
	    		console.log("Actors: " + body.Actors);
	    		console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
	    		console.log("Rotten Tomatoes URL: " + body.tomatoURL);
	    		appendLog(body);
	    		return; 
	  		}else{
	  			console.log(error);
	  		}
		});
}

function grabLIRI(){
	
	fs.readFile('random.txt', 'utf8', function(error,data){
		
		var defaultData = data.split(',');

		console.log(defaultData);

		userInput = defaultData[0];
		userSearch = defaultData[1];

		console.log(userInput);
		console.log(userSearch);

		userCommand(userInput, userSearch);
		
		return;
	});
}

userCommand(userInput, userSearch);