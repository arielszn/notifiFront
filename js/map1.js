var map, heatmap;
var markers =[];
var bird = 'images/bird.png';
var position;
var topic = 'Jews';

function initialize() {

  position = new google.maps.LatLng(48.8943515,2.3385841);

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
  
  var multiplierLat = 2;
  var multiplierLong = 2;
  if(topic=='Protest'){
    multiplierLat = 0.3;
    multiplierLong=0.2;
  }

  var fakeData = []

  for(i=-25;i<25;i++){
    fakeData.push({
                    "latitude": position.lat()+i*0.0005*Math.random()*multiplierLat,
                    "longitude": position.lng()+i*0.001*Math.random()*multiplierLong,
                    "tweet": "Tweet Reguarding " +topic,
                    "retweetsCount": Math.abs(i), 
                    "favouritesCount": Math.abs(i),
                    "user": "user_"+i 
                  });
  }

  paintMap(fakeData);

}

function protestaSimulation(tweetsData){

  var mapData = [];
  var markerContent = '';

  tweetsData.forEach(function(tweet){
    var point = new google.maps.LatLng(tweet.latitude, tweet.longitude);
    mapData.push(point);

    markerContent +=  '<div id="content">'+
                        '<div id="siteNotice">'+
                        '</div>'+
                        '<h4 id="firstHeading" class="firstHeading">'+
                          '<a target=\'blank\' href="https://twitter.com/arielszn">@'+tweet.user+'</a>' +
                        '</h4>'+
                        '<div id="bodyContent">'+
                          '<p><b>'+tweet.tweet+'</b></p>'+
                          '<p>Retweets: ' + tweet.retweetsCount + '</p>' +
                          '<p>Favs: ' + tweet.favouritesCount + '</p>' +
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

  if(topic=='Protest'){
    protestaSimulation(tweetsData);
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
        maxWidth: 350,
        maxHeight: 500
    });

    google.maps.event.addListener(marker, 'click', function() {
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
}

google.maps.event.addDomListener(window, 'load', initialize);
