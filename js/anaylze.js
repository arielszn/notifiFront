var tweets = [];
var neu_tweets = [];
var pos_tweets = [];
var neg_tweets = [];

function analyze(tweets) {
    tweets.forEach(function(tweet){
      switch (tweets[1]) {
        case "neutral":
        neu_tweets.push(tweet[0]);
        case "positive":
        pos_tweets.push(tweet[0]);
        case "negative":
        neg_tweets.push(tweet[0]);
}


