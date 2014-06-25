var map, pointarray, heatmap;
var markers = [];
var bird = 'images/bird.png';

function initialize() {

  var mapOptions = {
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

  if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = new google.maps.LatLng(position.coords.latitude,
                                     position.coords.longitude);

    var infowindow = new google.maps.InfoWindow({
      map: map,
      position: pos,
      content: 'You are here!'
    });

    map.setCenter(pos);
  }, function() {
    handleNoGeolocation(true);
  });
} else {
  handleNoGeolocation(false);
}

  heatmap = new google.maps.visualization.HeatmapLayer({

  });

  heatmap.setMap(map); // HEAT MAP

google.maps.event.addDomListener(window, "resize", function() { //RESIZE
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
});

google.maps.event.addListener(map, 'dragend', function() { drawFakeDataAround(map.getCenter()); } );

var data =[
      {"latitude":32.070038,"longitude":34.794121,"tweet": "jewish get out!", "user": "hitler", "retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070038,"longitude":34.794131,"tweet": "jewish get out!", "user": "hitler", "retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070038,"longitude":34.794141,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070038,"longitude":34.794141,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070038,"longitude":34.794151,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070039,"longitude":34.794141,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070048,"longitude":34.794164,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.070028,"longitude":34.794171,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0715741,"longitude":34.7957014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0712741,"longitude":34.7959014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0714741,"longitude":34.7953014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0714741,"longitude":34.7953014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0714741,"longitude":34.7953014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0714741,"longitude":34.7953014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15},
      {"latitude":32.0714741,"longitude":34.7952014,"tweet": "jewish get out!", "user": "hitler","retweetsCount":20, "favouritesCount":15}
  ]

  paintMap(data);


}


function handleNoGeolocation(errorFlag) {
if (errorFlag) {
  var content = 'Error: The Geolocation service failed.';
} else {
  var content = 'Error: Your browser doesn\'t support geolocation.';
  }
}

function paintMap(tweetsData) {

  var mapData = [];
cleanMarkers();

  tweetsData.forEach(function(tweet){

  var point = new google.maps.LatLng(tweet.latitude, tweet.longitude);

  mapData.push(point);



  var marker = new google.maps.Marker({
    position: point,
    map: map,
    title:  "\"" + tweet.tweet + "\"\r ",
    icon: bird
  });

   var contentString =  '<div id="content">'+
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
      maxWidth: 150
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  markers.push(marker);

});


  var pointArray = new google.maps.MVCArray(mapData);
  
  console.log(pointArray);

  heatmap.set('data', pointArray);
}

function cleanMarkers(){
  markers.forEach(function(marker){
    marker.setMap(null);
  })

  markers = [];
}


function tweetTopic(latLong, topic){
  var tweetsByTopic;
  alert(topic);
  topics = [];
  for(i=0; i<topics.length; i++){
    topics.push({
       "latitude": latLong.lat()+i*0.0005*Math.random()*2,
        "longitude": latLong.lng()+i*0.001*Math.random()*2,
        "tweet": topic,
        "retweetsCount": Math.abs(i), 
        "favouritesCount": Math.abs(i),
        "user": "user_"+i 
      });
  }
}

function drawFakeDataAround(latLong){


  var fakeData = []

  for(i=-25;i<25;i++){
    fakeData.push({
                    "latitude": latLong.lat()+i*0.0005*Math.random()*2,
                    "longitude": latLong.lng()+i*0.001*Math.random()*2,
                    "tweet": "new fake data "+i,
                    "retweetsCount": Math.abs(i), 
                    "favouritesCount": Math.abs(i),
                    "user": "user_"+i 
                  });
  }

  paintMap(fakeData);

}

google.maps.event.addDomListener(window, 'load', initialize);


