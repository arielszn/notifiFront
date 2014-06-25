var map, heatmap;
var markers =[];
var windows =[];
var bird = 'images/bird.png';
var position;
var topic = 'Discrimination';

function initialize() {

  position = new google.maps.LatLng(48.837222,2.296691);

  var mapOptions = {
    center: position,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.MAP,
    disableDefaultUI: true,
    zoomControl: false,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    scaleControl: true,
    navigationControl: true,
    draggable: true
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  heatmap = new google.maps.visualization.HeatmapLayer({
  });

  heatmap.setMap(map);

  google.maps.event.addDomListener(window, "resize", function() { //RESIZE
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
  });

  google.maps.event.addListener(map, 'dragend', function() { position = map.getCenter();
                                                             drawFakeDataAround(); 
                                                           } );

  drawFakeDataAround(position);

}

function setTopic(newTopic){
  topic = newTopic;
  drawFakeDataAround();
}

function drawFakeDataAround(){
  
  var multiplierLat = 1;
  var multiplierLong = 1.5;
  if(topic=='Protest'){
    multiplierLat = 0.3;
    multiplierLong=0.2;
  }

  if(topic=='Shooting'){
    multiplierLat = 0.05;
    multiplierLong=0.05;
  }

  var msg1;
  var msg2;
  var msg3;
  var msg4;

  if(topic=='Protest'){
    msg1='Lets protest against Jews, kick them out!';
    msg2='Lets smash the cars!';
    msg3="Everyone stay calm, everything will be okay!";
    msg4="Wow, the protest near Seine River is crazy!";
  }

  if(topic=='Discrimination'){
    msg1='I hate the Jews!';
    msg2='I can not understand why we dont fight back';
    msg3="Stay safe everyone, peace around the world!";
    msg4="Don't understand why people discriminate";
  }

  if(topic=='Shooting'){
    msg1='I am going to go on a rampage!!';
    msg2='I need to get revenge, against my enemies!';
    msg3="Everyone stay safe and stay away from the shooting!";
    msg4="Stay safe everyone, there are maniacs out there!";
  }



  var fakeData = []

  for(i=-20;i<20;i++){
    fakeData.push(
        { 
          tweet: msg1, 
          rating: "negative",
          retweetsCount: 10,
          favouritesCount:5,
          user:"Joey",
          latitude: position.lat()+i*0.0005*Math.random()*multiplierLat,
          longitude: position.lng()+i*0.001*Math.random()*multiplierLong
    });
    
    fakeData.push(
        { 
          tweet: msg2,
          rating: "negative", 
          retweetsCount: 15, 
          favouritesCount:6, 
          user:"Ryan",
          latitude: position.lat()+i*0.0005*Math.random()*multiplierLat,
          longitude: position.lng()+i*0.001*Math.random()*multiplierLong
        });

    fakeData.push(
        {
          tweet: msg4,
          rating: "neutral",
          retweetsCount: 10,
          favouritesCount:5,
          user:"Matt", 
          latitude: position.lat()+i*0.0005*Math.random()*multiplierLat,
          longitude: position.lng()+i*0.001*Math.random()*multiplierLong
        });

    fakeData.push(
        { 
          tweet: msg3,
          rating: "positive", 
          retweetsCount: 10,
          favouritesCount:5, 
          user:"Ben",
          latitude: position.lat()+i*0.0005*Math.random()*multiplierLat,
          longitude: position.lng()+i*0.001*Math.random()*multiplierLong
        });
                /*
                {tweet: "big protest against the jews right now in paris, be careful out there", rating: "neutral", retweetsCount: 10, favouritesCount:5, user:"BenKraw" },
                {tweet: "another example of why radical islam should be banned in france", rating: "negative", retweetsCount: 10, favouritesCount:5, user:"BenKraw" },
                {tweet: "lets show some solidarity for our jewish brothers #supportisrael", rating: "positive", retweetsCount: 10, favouritesCount:5, user:"BenKraw" },
                {tweet: "I support the jewish cause", rating: "positive", retweetsCount: 10, favouritesCount:5, user:"BenKraw" },
                {tweet: "I won't let history repeat itself -- #neverforget", rating: "positive", retweetsCount: 10, favouritesCount:5, user:"BenKraw" },
                {tweet: "let's stand together with israel guys", rating: "positive", retweetsCount: 10, favouritesCount:5, user:"BenKraw" },
                {tweet: "I love pizza", rating: "neutral", retweetsCount: 10, favouritesCount:5, user:"BenKraw" }
                    
                    "tweet": "Tweet Reguarding " +topic,
                    "retweetsCount": Math.abs(i), 
                    "favouritesCount": Math.abs(i),
                    "user": "user_"+i 
                  });
                */
  }

  console.log(fakeData);
  paintMap(fakeData);

}


function getBackground(rating){
  if(rating=='positive')
    return '#B8FF94';
  else if(rating=='negative')
    return '#FF6666';
  return '#DDDDAA';
}

function smallZoneSimulation(tweetsData){

  var mapData = [];
  var markerContent = '';

  tweetsData.forEach(function(tweet){
    var point = new google.maps.LatLng(tweet.latitude, tweet.longitude);
    mapData.push(point);

    var background = getBackground(tweet.rating);

    markerContent +=  '<div id="content" style=\'background-color:'+background+'\';>'+ 
                        '<div id="siteNotice">'+
                        '</div>'+
                        '<h4 id="firstHeading" class="firstHeading">'+
                          '<a target=\'blank\' href="https://twitter.com/arielszn">@'+tweet.user+'</a>' +
                        '</h4>'+
                        '<div id="bodyContent">'+
                          '<p><b>'+tweet.tweet+'</b></p>'+
                          '<p><em>Retweets: ' + tweet.retweetsCount + '</em></p>' +
                          '<p><em>Favs: ' + tweet.favouritesCount + '</em></p>' +
                        '</div>'+
                      '</div><hr>';

    

  }); 

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title:  "Protest",
    icon: bird
  });

  var infowindow = new google.maps.InfoWindow({
    content: markerContent,
    maxWidth: 300
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  markers.push(marker);

  var pointArray = new google.maps.MVCArray(mapData);

  heatmap.set('data', pointArray);
}

function paintMap(tweetsData) {

  var mapData = [];
  cleanMarkers();

  if(topic!="Discrimination"){
    smallZoneSimulation(tweetsData);
    return;
  }

  tweetsData.forEach(function(tweet){
    var point = new google.maps.LatLng(tweet.latitude, tweet.longitude);
    mapData.push(point);

    var marker = new google.maps.Marker({
      position: point,
      map: map,
      title:  "\"" + tweet.tweet + "\"\r ",
      icon: bird
    });

    var background = getBackground(tweet.rating);



    var contentString =  '<div id="content" style=\'background-color:'+background+'\';>'+ 
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<h1 id="firstHeading" class="firstHeading">'+
                              '<a target=\'blank\' href="https://twitter.com/arielszn">@'+tweet.user+'</a>' +
                            '</h1>'+
                            '<div id="bodyContent">'+
                              '<p><b>'+tweet.tweet+'</b></p>'+
                              '<p>Retweets: ' + tweet.retweetsCount + '</p>' +
                              '<p>Favs: ' + tweet.favouritesCount + '</p>' +
                            '</div>'+
                          '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 350,
        maxHeight: 500
    });

    windows.push(infowindow);

    google.maps.event.addListener(marker, 'click', function() {
      closeAllWindows();
      infowindow.open(map,marker);
    });

    markers.push(marker);

  }); 

  var pointArray = new google.maps.MVCArray(mapData);

  heatmap.set('data', pointArray);
}

function cleanMarkers(){
  markers.forEach(function(marker){
    marker.setMap(null);
  })
  markers = [];
  windows = [];
}

function closeAllWindows(){
  windows.forEach(function(iWindow){
    iWindow.close();
  })
}


google.maps.event.addDomListener(window, 'load', initialize);


