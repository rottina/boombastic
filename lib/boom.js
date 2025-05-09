// var context = new AudioContext(),
//     analyser = this.context.createAnalyser(),
//     frequencyData = new Uint8Array(this.analyser.frequencyBinCount),
//     sourceNode, audios, currentAudio,
//     visualisation = document.getElementById("visualisation"),
//     // $("#visualisation"),
//     bars = document.getElementById("visualisation > div"),
//     barSpacingPercent = 100 / this.analyser.frequencyBinCount;

let Boom = {
  init: ()=> {
    console.log('in INIT');
    Boom.getTracks('https://itunes.apple.com/us/rss/topsongs/limit=25/genre=6/explicit=true/xml', 'xml');
    // let taglineElement = document.getElementById("tagline");

    //let cs = document.getElementById("chartselector");
    
    //taglineElement.innerText(chrome.i18n.getMessage('headingTagline'));

    //analyser.fftSize = 64;
    //analyser.smoothingTimeConstant = 0.822;
    //let lastListenedTo = localStorage['lastListenedTo'] || null;
  },

  getTracks: async function getData(playlist, dataType) {
    console.log('in gettracks '+ playlist);
    const response = await fetch(playlist);
      
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const tracks = await response.text();
    
        if (tracks) {
          if (dataType === 'xml') {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(tracks, 'text/xml');
            //console.log(Object.values(xmlDoc)); 
            const nodeList = xmlDoc.querySelectorAll("entry");
            for (const [i, node] of nodeList.entries()) {
              console.group(i, node);
              console.log(`%c${i}`, 'color:red', node.querySelector('title').textContent);
              console.log(i, node.querySelector('rights').textContent);
              console.log(i, node.querySelector("artist").textContent);
              console.groupEnd();
            };
            // console.log(xmlDoc.getElementsByTagName('entry')[0]);
            // console.log(xmlDoc.getElementsByTagName('im:name')[0]);
            // console.log(xmlDoc.getElementsByTagName('title')[0]);
          } else {
            //json  [0].childNodes[5]
          }

        } else {
          console.error('Failed to parse response');
        }
    
  }

}

window.addEventListener("load", (event)=> {
  console.log("extension loaded");
  Boom.init();
});
  
  // if ((lastListenedTo === null) || (lastListenedTo.toLowerCase() === '')) {
    //     $('select option[value="https://pitchfork.com/feed/reviews/best/tracks/rss"]').attr('selected', 'selected');
    //     Boom.getXmlChart('https://pitchfork.com/feed/reviews/best/tracks/rss', 'item');
    // } else {
    //   $('select option[value="'+ localStorage['lastListenedTo'] +'"]').attr('selected', 'selected');
    //   if (lastListenedTo.indexOf('http') == -1) {
    //     Boom.getInternalChart(lastListenedTo);
    //   } else if (lastListenedTo.indexOf('apple') != -1) {
    //     Boom.getXmlChart(lastListenedTo, 'entry');
    //   } else {
    //     Boom.getXmlChart(lastListenedTo, 'item');
    //   }
  //   }
  // },

  // getXmlChart: function(url, findNode) {
  //   $.ajax({
  //   type: "GET",
  //   url: url,
  //   dataType: 'xml',
  //   timeout: 5000,
  //   success: function(data) {
  //     if (data) {
  //       var xmlChart = [],
  //           item = $(data).find(findNode),
  //           iTunesTerm = '',
  //           artist,
  //           song,
  //           title;
  //       $(item).each(function(i, value) {
  //         if (url.indexOf('billboard') != -1) {
  //           artist = $(value).children('artist').text();
  //           song = $(value).children('chart_item_title').text();
  //         } else if (url.indexOf('pitchfork') != -1) {
  //           title = $(value).children('title').text();
  //           title = title.replace(/"/g, '');
  //           artist = title.split(': ')[0];
  //           song = title.split(': ')[1];
  //         } else if (url.indexOf('amazon') != -1) {
  //           title = $(value).children('title').text();
  //           artist = '';
  //           song = title.split(': ')[1];
  //         } else if (url.indexOf('feedburner') != -1) {
  //           title = $(value).children('title').text();
  //           artist = title.split(' - ')[0];
  //           song = title.split(' - ')[1];
  //         } else {
  //           title = $(value).children('title').text();
  //           artist = title.split(' - ')[0];
  //           song = title.split(' - ')[1];
  //         }
  //         iTunesTerm = Boom.createItunesSearchTerm(artist +' '+ song);
  //         xmlChart.push({ artist:artist, song:song });
  //       });
  //       Boom.displayChart(xmlChart);
  //     }  else {
  //       return xmlChart = [];
  //     }
  //   },
  //   error: Boom.displayError
  //   });
  // },

  // getInternalChart: function(url) {
  //   var customChart = [], iTunesTerm = '', theData = [], artist, song;
  //   switch(url) {
  //   case 'custom-playlist-prince':
  //     theData = [{'song':'City in the Sky','artist':'The Staple Singers'},{'song':'Country John','artist':'Allen Toussaint'},{'song':'Fire','artist':'Ohio Players'},{'song':'Happy House','artist':'Shuggie Otis'},{'song':'Higher Ground','artist':'Stevie Wonder'},{'song':'I Was Made to Love Him','artist':'Chaka Khan'},{'song':'Listen to the Music','artist':'The Isley Brothers'},{'song':'The Lord is Back','artist':'Eugene McDaniels'},{'song':'Lost in Music','artist':'Sister Sledge'},{'song':'The Pinocchio Theory','artist':'Bootsy Collins'},{'song':'Rubber Duckie','artist':'Bootsy Collins'},{'song':'Rumpofsteelskin','artist':'Parliament'},{'song':'Skin Tight','artist':'Ohio Players'},{'song':'We\'re Gettin Too Close','artist':'The Soul Children'},{'song':'Wild and Free','artist':'Curtis Mayfield'},{'song':'After The Love Has Gone','artist':'Earth, Wind'},{'song':'Back in Baby\'s Arms','artist':'Allen Toussaint'},{'song':'Don\'t Let Me Be Lonely Tonight','artist':'The Isley Brothers'},{'song':'Don\'t Take My Sunshine','artist':'The Soul Children'},{'song':'How Could I Let You Get Away','artist':'The Spinners'},{'song':'I\'ll Be Around','artist':'The Spinners'},{'song':'Push Me Away','artist':'The Jacksons'},{'song':'Stay With Me','artist':'Shirley Brown'},{'song':'The Thrill Is Gone','artist':'Aretha Franklin'}]
  //     break;
  //     case 'custom-rs-sexiest':
  //       theData = [{'artist':'Olivia Newton','song':'Physical'},{'artist':'Rod Stewart','song':'Tonight\'s The Night'},{'artist':'Boyz II Men','song':'I\'ll Make Love To You'},{'artist':'Next','song':'Too Close'},{'artist':'Marvin Gaye','song':'Let\'s Get It On'},{'artist':'Donna Summer','song':'Hot Stuff'},{'artist':'Tennille','song':'Do That To Me One More Time'},{'artist':'Madonna','song':'Like A Virgin'},{'artist':'Exile','song':'Kiss You All Over'},{'artist':'Rod Stewart','song':'Da Ya Think I\'m Sexy'}];
  //       break;
  //     default:
  //       theData = [{'artist':'Prince','song':'When Doves Cry'},{'artist':'Madonna','song':'Borderline'},{'artist':'Chaka Khan','song':'I Feel for You'},{'artist':'Prince and the Revolution','song':'Let\'s Go Crazy'},{'artist':'Michael Jackson','song':'Thriller'},{'artist':'Cyndi Lauper','song':'Time After Time'},{'artist':'Don Henley','song':'The Boys of Summer'},{'artist':'Prince and the Revolution','song':'Purple Rain'},{'artist':'Bruce Springsteen','song':'Born in the U.S.A'},{'artist':'Sheila E.','song':'The Glamorous Life'},{'artist':'Tina Turner','song':'What\'s Love Got to Do With It?'},{'artist':'U2','song':'Pride (in the Name of Love)'},{'artist':'Newcleus','song':'Jam on It'},{'artist':'John Waite','song':'Missing You'},{'artist':'Nena','song':'99 Luftballons'},{'artist':'Tracey Ullman','song':'They Don\'t Know'},{'artist':'Sade','song':'Smooth Operator'},{'artist':'a-ha','song':'Take on Me'},{'artist':'Ashford %26 Simpson','song':'Solid'},{'artist':'Van Halen','song':'Panama'}];
  //       break; //1984
  //   }
  //   for (var i in theData) {
  //     artist = theData[i].artist;
  //     song = theData[i].song;
  //     customChart.push({ artist:artist, song:song });
  //     iTunesTerm = Boom.createItunesSearchTerm(artist +' '+ song);
  //   }
  //   Boom.displayChart(customChart);
  // },

  // displayChart: function(theChart) {
  //   const iTunesStoreLogo = "/img/iTunes_Store_Small_Badge_RGB_012318.svg";
  //   var iTunesTerm = '', listItemCollection = [], arrayLength = theChart.length, artist, song;
  //   for (var i = 0; i < arrayLength; i++) {
  //     iTunesTerm = Boom.createItunesSearchTerm(theChart[i].artist +' '+ theChart[i].song);
  //     $.getJSON('https://itunes.apple.com/search?limit=1&entity=song&term='+iTunesTerm, function(data) {
  //       $.each(data, function() {

  //         $.each(this, function(s, song) {

  //           let li = document.createElement('li'),
  //             a = document.createElement('a'),
  //             img = document.createElement('img'),
  //             h3 = document.createElement('h3'),
  //             h4 = document.createElement('h4'),
  //             audio = document.createElement('audio'),
  //             logo = document.createElement('img'),
  //             artistName = song.artistName || '',
  //             artworkUrl60 = song.artworkUrl60 || '',
  //             trackCensoredName = song.trackCensoredName || '',
  //             trackId = song.trackId || '',
  //             previewUrl = song.previewUrl || '#',
  //             trackViewUrl = song.trackViewUrl || '',
  //             h3Text, h4Text;

  //           a.href = '#';
  //           a.setAttribute('id', trackId);
  //           a.setAttribute('title', artistName + ' – "' + trackCensoredName + '" in iTunes');

  //           logo.src = iTunesStoreLogo;
  //           logo.alt = "iTunes Store";
  //           logo.setAttribute('class', 'itms');
  //           logo.setAttribute('title', 'Get it on iTunes');

  //           audio.setAttribute('type', 'audio/mpeg');
  //           audio.setAttribute('src', previewUrl);
  //           audio.setAttribute('preload', 'auto');
  //           audio.setAttribute('controls', '');
  //           if(previewUrl == '#') {
  //             audio.setAttribute('class', 'noaudio');
  //             audio.setAttribute('title', 'No audio available');
  //           }

  //           img.src = artworkUrl60;
  //           img.setAttribute('height', '60');
  //           img.setAttribute('width', '60');
  //           img.setAttribute('alt', 'album art');
  //           img.setAttribute('class', 'album');

  //           h3Text = document.createTextNode(artistName);
  //           h3.appendChild(h3Text);
  //           h4Text = document.createTextNode(trackCensoredName);
  //           h4.appendChild(h4Text);
  //           trackViewUrl = Boom.getLocalizedLink(trackViewUrl);

  //           a.appendChild(img);
  //           a.appendChild(h3);
  //           a.appendChild(h4);
  //           li.appendChild(a);
  //           li.appendChild(audio);
  //           li.appendChild(logo);
  //           listItemCollection[i++] = li;
  //           a.onclick = function() {
  //             chrome.tabs.update(null, {url: trackViewUrl});
  //             return(false);
  //           }.bind(this, trackViewUrl);
  //           $('section ol').append(li);
  //         });
  //       });
  //     });
  //   }
  // },

  // getLocalizedLink: function(url) {
  //   var userLocale = chrome.i18n.getMessage('@@ui_locale');
  //   var iTunesCountry = 'us';
  //   switch(userLocale) {
  //     case 'ar': iTunesCountry = 'sa'; break;
  //     case 'am': iTunesCountry = 'bf'; break;
  //     case 'bg': iTunesCountry = 'bg'; break;
  //     case 'bn': iTunesCountry = 'in'; break;
  //     case 'ca': iTunesCountry = 'es'; break;
  //     case 'cs': iTunesCountry = 'cz'; break;
  //     case 'da': iTunesCountry = 'dk'; break;
  //     case 'de': iTunesCountry = 'de'; break;
  //     case 'el': iTunesCountry = 'gr'; break;
  //     case 'en': iTunesCountry = 'us'; break;
  //     case 'en_GB': iTunesCountry = 'gb'; break;
  //     case 'en_US': iTunesCountry = 'us'; break;
  //     case 'es': iTunesCountry = 'es'; break;
  //     case 'es_419': iTunesCountry = 'mx'; break;
  //     case 'et': iTunesCountry = 'ee'; break;
  //     case 'fa': iTunesCountry = 'us'; break;
  //     case 'fi': iTunesCountry = 'fi'; break;
  //     case 'fil': iTunesCountry = 'ph'; break;
  //     case 'fr': iTunesCountry = 'fr'; break;
  //     case 'he': iTunesCountry = 'il'; break;
  //     case 'hi': iTunesCountry = 'in'; break;
  //     case 'hr': iTunesCountry = 'hr'; break;
  //     case 'hu': iTunesCountry = 'hu'; break;
  //     case 'id': iTunesCountry = 'id'; break;
  //     case 'it': iTunesCountry = 'it'; break;
  //     case 'ja': iTunesCountry = 'jp'; break;
  //     case 'kn': iTunesCountry = 'in'; break;
  //     case 'ko': iTunesCountry = 'kr'; break;
  //     case 'lt': iTunesCountry = 'lt'; break;
  //     case 'lv': iTunesCountry = 'lv'; break;
  //     case 'ml': iTunesCountry = 'in'; break;
  //     case 'mr': iTunesCountry = 'in'; break;
  //     case 'ms': iTunesCountry = 'my'; break;
  //     case 'nl': iTunesCountry = 'nl'; break;
  //     case 'no': iTunesCountry = 'no'; break;
  //     case 'pl': iTunesCountry = 'pl'; break;
  //     case 'pt_BR': iTunesCountry = 'br'; break;
  //     case 'pt_PT': iTunesCountry = 'pt'; break;
  //     case 'ro': iTunesCountry = 'ro'; break;
  //     case 'ru': iTunesCountry = 'ru'; break;
  //     case 'sk': iTunesCountry = 'sk'; break;
  //     case 'sl': iTunesCountry = 'si'; break;
  //     case 'sr': iTunesCountry = 'si'; break;
  //     case 'sv': iTunesCountry = 'se'; break;
  //     case 'sw': iTunesCountry = 'tz'; break;
  //     case 'ta': iTunesCountry = 'in'; break;
  //     case 'te': iTunesCountry = 'in'; break;
  //     case 'th': iTunesCountry = 'th'; break;
  //     case 'tr': iTunesCountry = 'tr'; break;
  //     case 'uk': iTunesCountry = 'ua'; break;
  //     case 'vi': iTunesCountry = 'vn'; break;
  //     case 'zh_CN': iTunesCountry = 'cn'; break;
  //     case 'zh_TW': iTunesCountry = 'tw'; break;
  //     default: iTunesCountry = 'us'; break;
  //   }
  //   if (url !== '' && url !== undefined && url !== 'undefined') {
  //     url = url.replace(url.split('/')[3], iTunesCountry) + '&app=itunes&at=11l9uH';
  //   }
  //   return url;
  // },

  // createItunesSearchTerm: function(searchterm) {
  //   searchterm = searchterm.replace(/ /g, '+');
  //   return searchterm;
  // },

  // displayError: function() {
  //   // hide gracefully
  // },

  // update: ()=> {
  //   requestAnimationFrame(Boom.update);
  //   analyser.getByteFrequencyData(frequencyData);
  //   var fullBG = 0;
  //   bars.each(function (index, bar) {
  //     var barHeightPerc = frequencyData[index]/256,
  //     r = Math.floor(barHeightPerc*255),
  //     g = 0,
  //     b = 255 - Math.floor(barHeightPerc*255);
  //     bar.style.height = barHeightPerc*25 + 'px';
  //     bar.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
  //   });
  // },

  // setCurrentAudio: function(currentAudio) {
  //   sourceNode = context.createMediaElementSource(currentAudio);
  //   sourceNode.connect(analyser);
  //   analyser.connect(context.destination);
  //   analyser.getByteFrequencyData(frequencyData);
  //   for (var i=0; i < analyser.frequencyBinCount; i++) {
  //     // $("<div/>").css("left", i * barSpacingPercent + "%").appendTo(visualisation);
  //   }
    //Boom.update();
//   }
// },

// (() => {
//   console.log('in init');
//   Boom.init();
  // document.addEventListener('play', function (e) {
  //   audios = document.getElementsByTagName('audio');
  //   for (var i = 0, len = audios.length; i < len; i++) {
  //     if (audios[i] != e.target) {
  //       audios[i].pause();
  //     } else {
  //       currentAudio = audios[i];
  //       Boom.setCurrentAudio(currentAudio);
  //     }
  //   }
  // }, true);
  // document.getElementById('chartselector').addEventListener("change", (e)=> {
  //   console.log('change fired ' + e.target.tagName + e.target.value);
  //   localStorage['lastListenedTo'] = e.target.value;
  //   li.remove();
  //   if (this.value.indexOf('apple') != -1) {
  //     Boom.getXmlChart(this.value, 'entry');
  //   } else if (this.value.indexOf('http') == -1) {
  //     Boom.getInternalChart(this.value);
  //   } else {
  //     Boom.getXmlChart(this.value, 'item');
  //   }
  // }, false);
//});