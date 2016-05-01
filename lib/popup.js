var context = new AudioContext(),
    analyser = this.context.createAnalyser(),
    frequencyData = new Uint8Array(this.analyser.frequencyBinCount),
    sourceNode, audios, currentAudio,
    visualisation = $("#visualisation"),
    bars = $("#visualisation > div"),
    barSpacingPercent = 100 / this.analyser.frequencyBinCount;

var Boom = {
  init: function() {
    $('h2').text(chrome.i18n.getMessage('headingTagline'));
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.822;
    var lastListenedTo = localStorage['lastListenedTo'] || null;
    if ((lastListenedTo === null) || (lastListenedTo.toLowerCase() === '')) {
        $('select option[value="http://np.absoluteradio.co.uk/played/abr.rss"]').attr('selected', 'selected');
        Boom.getXmlChart('http://np.absoluteradio.co.uk/played/abr.rss', 'item');
    } else {
      $('select option[value="'+ localStorage['lastListenedTo'] +'"]').attr('selected', 'selected');
      if (lastListenedTo.indexOf('http') == -1) {
        Boom.getInternalChart(lastListenedTo);
      } else if (lastListenedTo.indexOf('spotify') != -1) {
        Boom.getSpotifyChart(lastListenedTo);
      } else if (lastListenedTo.indexOf('audioscrobbler') != -1) {
        Boom.getXmlChart(lastListenedTo, 'track');
      } else if (lastListenedTo.indexOf('apple') != -1) {
        Boom.getXmlChart(lastListenedTo, 'entry');
      } else {
        Boom.getXmlChart(lastListenedTo, 'item');
      }
    }
  },

  getXmlChart: function(url, findNode) {
    $.ajax({
    type: "GET",
    url: url,
    dataType: 'xml',
    timeout: 5000,
    success: function(data) {
      if (data) {
        var xmlChart = [],
            item = $(data).find(findNode),
            iTunesTerm = '',
            artist,
            song,
            title;
        $(item).each(function(i, value) {
          if (url.indexOf('billboard') != -1) {
            artist = $(value).children('artist').text();
            song = $(value).children('chart_item_title').text();
          } else if (url.indexOf('pitchfork') != -1) {
            title = $(value).children('title').text();
            title = title.replace(/"/g, '');
            artist = title.split(': ')[0];
            song = title.split(': ')[1];
          } else if (url.indexOf('audioscrobbler') != -1) {
            artist = $(value).children('artist').children('name').text();
            song = $(value).children('name').text();
          } else if (url.indexOf('amazon') != -1) {
            title = $(value).children('title').text();
            artist = '';
            song = title.split(': ')[1];
          } else if (url.indexOf('take40') != -1) {
            artist = $(value).children('description').text();
            song = $(value).children('title').text();
          } else if (url.indexOf('absoluteradio.co.uk') != -1 || url.indexOf('hypem.com') != -1  || url.indexOf('feedburner.com') != -1 ) {
            title = $(value).children('title').text();
            artist = title.split(' - ')[0];
            song = title.split(' - ')[1];
          } else {
            artist = $(value).children('im\\:artist').text();
            song = $(value).children('im\\:name').text();
          }
          iTunesTerm = Boom.createItunesSearchTerm(artist +' '+ song);
          xmlChart.push({ artist:artist, song:song });
        });
        Boom.displayChart(xmlChart);
      }  else {
        return xmlChart = [];
      }
    },
    error: Boom.displayError
    });
  },

  getInternalChart: function(url) {
    var customChart = [], iTunesTerm = '', theData = [], artist, song;
    switch(url) {

    case 'custom-playlist-prince':
      theData = [{'song':'City in the Sky','artist':'The Staple Singers'},{'song':'Country John','artist':'Allen Toussaint'},{'song':'Fire','artist':'Ohio Players'},{'song':'Happy House','artist':'Shuggie Otis'},{'song':'Higher Ground','artist':'Stevie Wonder'},{'song':'I Was Made to Love Him','artist':'Chaka Khan'},{'song':'Listen to the Music','artist':'The Isley Brothers'},{'song':'The Lord is Back','artist':'Eugene McDaniels'},{'song':'Lost in Music','artist':'Sister Sledge'},{'song':'The Pinocchio Theory','artist':'Bootsy Collins'},{'song':'Rubber Duckie','artist':'Bootsy Collins'},{'song':'Rumpofsteelskin','artist':'Parliament'},{'song':'Skin Tight','artist':'Ohio Players'},{'song':'We\'re Gettin Too Close','artist':'The Soul Children'},{'song':'Wild and Free','artist':'Curtis Mayfield'},{'song':'After The Love Has Gone','artist':'Earth, Wind'},{'song':'Back in Baby\'s Arms','artist':'Allen Toussaint'},{'song':'Don\'t Let Me Be Lonely Tonight','artist':'The Isley Brothers'},{'song':'Don\'t Take My Sunshine','artist':'The Soul Children'},{'song':'How Could I Let You Get Away','artist':'The Spinners'},{'song':'I\'ll Be Around','artist':'The Spinners'},{'song':'Push Me Away','artist':'The Jacksons'},{'song':'Stay With Me','artist':'Shirley Brown'},{'song':'The Thrill Is Gone','artist':'Aretha Franklin'}]
      break;
      case 'custom-rs-sexiest':
        theData = [{'artist':'Olivia Newton','song':'Physical'},{'artist':'Rod Stewart','song':'Tonight\'s The Night'},{'artist':'Boyz II Men','song':'I\'ll Make Love To You'},{'artist':'Next','song':'Too Close'},{'artist':'Marvin Gaye','song':'Let\'s Get It On'},{'artist':'Donna Summer','song':'Hot Stuff'},{'artist':'Tennille','song':'Do That To Me One More Time'},{'artist':'Madonna','song':'Like A Virgin'},{'artist':'Exile','song':'Kiss You All Over'},{'artist':'Rod Stewart','song':'Da Ya Think I\'m Sexy'}];
        break;
      case 'custom-rs-summersongs-1970s':
        theData = [{'artist':'The Knack','song':'My Sharona'},{'artist':'The Emotions','song':'Best of My Love'},{'artist':'Donna Summer','song':'Bad Girls'},{'artist':'Carole King','song':'I Feel the Earth Move'},{'artist':'The Carpenters','song':'(They Long To Be) Close To You'},{'artist':'Elton John %26 Kiki Dee','song':'Don\'t Go Breaking My Heart'},{'artist':'Jim Croce','song':'Bad, Bad Leroy Brown'},{'artist':'Wild Cherry','song':'Play That Funky Music'},{'artist':'Edwin Starr','song':'War'},{'artist':'Hot','song':'Angel in Your Arms'},{'artist':'Diana Ross','song':'Ain\'t No Mountain High Enough'},{'artist':'The Raiders','song':'Indian Reservation (The Lament of the Cherokee Reservation Indian)'},{'artist':'A Taste of Honey','song':'Boogie Oogie Oogie'},{'artist':'Anita Ward','song':'Ring My Bell'},{'artist':'Walter Murphy and the Big Apple Band','song':'A Fifth of Beethoven'},{'artist':'Freda Payne','song':'Band of Gold'},{'artist':'Three Dog Night','song':'Mama Told Me (Not To Come)'},{'artist':'Frankie Valli','song':'Grease'},{'artist':'Al Green','song':'Tired of Being Alone'},{'artist':'Jimmy Buffett','song':'Margaritaville'}];
       break;
      case 'custom-rs-country-saddest':
        theData = [{'artist':'Shelby Lynne','song':'Heaven\'s Only Days Down the Road'},{'artist':'Alan Jackson','song':'Where Were You (When the World Stopped Turning)'},{'artist':'Red Foley','song':'Old Shep'},{'artist':'Lefty Frizzell','song':'Long Black Veil'},{'artist':'Reba McEntire','song':'She Thinks His Name Was John'},{'artist':'Faron Young','song':'Hello Walls'},{'artist':'Johnny Cash','song':'Sunday Morning Coming Down'},{'artist':'John Michael Montgomery','song':'The Little Girl'},{'artist':'George Jones','song':'He Stopped Loving Her Today'},{'artist':'Brad Paisley and Alison Krauss','song':'Whiskey Lullaby'},{'artist':'Hank Williams','song':'I\'m So Lonesome I Could Cry'},{'artist':'Martina McBride','song':'Concrete Angel'}];
        break;
      case 'custom-rs-hiphop-greatest':
        theData = [{'artist':'Grandmaster Flash and the Furious Five','song':'The Message'},{'artist':'Sugarhill Gang','song':'Rapper\'s Delight'},{'artist':'Afrika Bambaataa & the Soul Sonic Force','song':'Planet Rock'},{'artist':'Run-DMC','song':'Sucker M.C.\'s'},{'artist':'Geto Boys','song':'Mind Playing Tricks on Me'},{'artist':'Dr. Dre','song':'Nuthin But a \'G\' Thang'},{'artist':'Public Enemy','song':'Fight the Power'},{'artist':'Notorious B.I.G','song':'Juicy'},{'artist':'N.W.A.','song':'Straight Outta Compton'},{'artist':'Eric B. and Rakim','song':'Paid in Full'}];
        break;
      case 'custom-rs-best-2000s':
        theData = [{'artist':'Gnarls Barkley','song':'Crazy'},{'artist':'Jay-Z','song':'99 Problems'},{'artist':'Beyoncé','song':'Crazy in Love'},{'artist':'OutKast','song':'Hey Ya!'},{'artist':'M.I.A.','song':'Paper Planes'},{'artist':'The White Stripes','song':'Seven Nation Army'},{'artist':'Yeah Yeah Yeahs','song':'Maps'},{'artist':'Amy Winehouse','song':'Rehab'},{'artist':'U2','song':'Beautiful Day'},{'artist':'Eminem','song':'Stan'},{'artist':'MGMT','song':'Time to Pretend'},{'artist':'Eminem','song':'Lose Yourself'},{'artist':'50 Cent','song':'In Da Club'},{'artist':'Missy Elliott','song':'Get Ur Freak On'},{'artist':'Johnny Cash','song':'Hurt'},{'artist':'The Strokes','song':'Last Nite'},{'artist':'Bob Dylan','song':'Mississippi'},{'artist':'Kelly Clarkson','song':'Since U Been Gone'},{'artist':'Kanye West','song':'Jesus Walks'},{'artist':'Justin Timberlake','song':'Cry Me a River'}];
        break;
      case 'custom-bilboard-1968':
        theData = [ {'artist':'The Beatles','song':'Hello, Goodbye'}, {'artist':'John Fred and His Playboy Band','song':'Judy in Disguise'}, {'artist':'The Lemon Pipers','song':'Green Tambourine'}, {'artist':'Paul Mauriat','song':'Love is Blue'}, {'artist':'Otis Redding','song':'Dock of the Bay'}, {'artist':'Bobby Goldsboro','song':'Honey'}, {'artist':'Archie Bell %26 the Drells','song':'Tighten Up'}, {'artist':'Simon %26 Garfunkel','song':'Mrs. Robinson'}, {'artist':'Herb Alpert','song':'This Guy\'s in Love with You'}, {'artist':'Hugh Masekela','song':'Grazing in the Grass'}, {'artist':'The Doors','song':'Hello, I love you'}, {'artist':'The Rascals','song':'People Got to Be Free'}, {'artist':'Jeannie C. Riley','song':'Harper Valley PTA'}, {'artist':'The Beatles','song':'Hey Jude'}, {'artist':'Diana Ross %26 the Supremes','song':'Love Child'}, {'artist':'Marvin Gaye','song':'I Heard It Through the Grapevine'} ];
      break;
      case 'custom-bilboard-1969':
        theData = [ {'artist':'Marvin Gaye','song':'I Heard It Through the Grapevine'}, {'artist':'Tommy James %26 the Shondells','song':'Crimson and Clover'}, {'artist':'Everyday People','song':'Sly %26 the Family Stone'}, {'artist':'Aquarius','song':'5th Dimension'}, {'artist':'The Beatles','song':'Get Back'}, {'artist':'Zager and Evans','song':'In the Year 2525'}, {'artist':'The Rolling Stones','song':'Honky Tonk Women'}, {'artist':'The Archies','song':'Sugar, Sugar'}, {'artist':'The Temptations','song':'I Can\'t Get Next to You'}, {'artist':'Elvis Presley','song':'Suspicious Minds'}, {'artist':'5th Dimension','song':'Wedding Bell Blues'}, {'artist':'The Beatles','song':'Come Together'}, {'artist':'Steam','song':'Na Na Hey Hey Kiss Him Goodbye'}, {'artist':'Peter, Paul %26 Mary','song':'Leaving on a Jet Plane'}, {'artist':'Diana Ross %26 the Supremes','song':'Someday We\'ll Be Together'} ];
      break;
      case 'custom-bilboard-1970':
        theData = [ {'artist':'B.J. Thomas','song':'Raindrops Keep Fallin\' On My Head'}, {'artist':'Jackson 5','song':'I Want You Back'}, {'artist':'The Shocking Blue','song':'Venus'}, {'artist':'Sly %26 The Family Stone','song':'Thank You Falettinme Be Mice Elf Agin'}, {'artist':'Simon %26 Garfunkel','song':'Bridge Over Troubled Water'}, {'artist':'The Beatles','song':'Let It Be'}, {'artist':'Jackson 5','song':'ABC'}, {'artist':'The Guess Who','song':'American Woman'}, {'artist':'Ray Stevens','song':'Everything Is Beautiful'}, {'artist':'The Beatles','song':'The Long And Winding Road'}, {'artist':'Jackson 5','song':'The Love You Save'}, {'artist':'Three Dog Night','song':'Mama Told Me (Not To Come)'}, {'artist':'Carpenters','song':'Close To You'}, {'artist':'Bread','song':'Make It With You'}, {'artist':'Edwin Starr','song':'War'}, {'artist':'Diana Ross','song':'Ain\'t No Mountain High Enough'}, {'artist':'Neil Diamond','song':'Cracklin\' Rosie'}, {'artist':'Jackson 5','song':'I\'ll Be There'}, {'artist':'The Partridge Family','song':'I Think I Love You'}, {'artist':'Smokey Robinson','song':'The Tears Of A Clown'}, {'artist':'George Harrison','song':'My Sweet Lord'} ];
        break;
      case 'custom-bilboard-1971':
        theData = [ {'artist':'George Harrison','song':'My Sweet Lord'}, {'artist':'Dawn','song':'Knock Three Times'}, {'artist':'The Osmonds','song':'One Bad Apple'}, {'artist':'Janis Joplin','song':'Me And Bobby McGee'}, {'artist':'The Temptations','song':'Just My Imagination'}, {'artist':'Three Dog Night','song':'Joy To The World'}, {'artist':'The Rolling Stones','song':'Brown Sugar'}, {'artist':'The Honey Cone','song':'Want Ads'}, {'artist':'Carole King','song':'I Feel The Earth Move'}, {'artist':'The Raiders','song':'Indian Reservation'}, {'artist':'James Taylor','song':'You\'ve Got A Friend'}, {'artist':'Bee Gees','song':'How Can You Mend A Broken Heart'}, {'artist':'Uncle Albert','song':'Paul %26 Linda McCartney'}, {'artist':'Donny Osmond','song':'Go Away Little Girl'}, {'artist':'Rod Stewart','song':'Maggie May'}, {'artist':'Cher','song':'Gypsys, Tramps %26 Thieves'}, {'artist':'Isaac Hayes','song':'Theme From Shaft'}, {'artist':'Sly %26 The Family Stone','song':'Family Affair'}, {'artist':'Melanie','song':'Brand New Key'} ];
        break;
      case 'custom-bilboard-1972':
        theData = [ {'artist':'Melanie','song':'Brand New Key'}, {'artist':'Don McLean ','song':'American Pie'}, {'artist':'Al Green','song':'Let\'s Stay Together'}, {'artist':'Nilsson','song':'Without You'}, {'artist':'Neil Young','song':'Heart Of Gold'}, {'artist':'America','song':'A Horse With No Name'}, {'artist':'Roberta Flack','song':'The First Time Ever I Saw Your Face'}, {'artist':'The Chi-lites','song':'Oh Girl'}, {'artist':'The Staple Singers','song':'I\'ll Take You There'}, {'artist':'Sammy Davis, Jr.','song':'The Candy Man'}, {'artist':'Neil Diamond','song':'Song Sung Blue'}, {'artist':'Bill Withers','song':'Lean On Me'}, {'artist':'Gilbert O\'Sullivan','song':'Alone Again'}, {'artist':'Looking Glass','song':'Brandy'}, {'artist':'Three Dog Night','song':'Black %26 White'}, {'artist':'Mac Davis','song':'Baby Don\'t Get Hooked On Me'}, {'artist':'Michael Jackson','song':'Ben'}, {'artist':'Chuck Berry','song':'My Ding-A-Ling'}, {'artist':'Johnny Nash','song':'I Can See Clearly Now'}, {'artist':'The Temptations','song':'Papa Was A Rollin\' Stone'}, {'artist':'Helen Reddy','song':'I Am Woman'}, {'artist':'Billy Paul','song':'Me And Mrs. Jones'} ];
        break;
      case 'custom-bilboard-1973':
        theData = [ {'artist':'Carly Simon','song':'You\'re So Vain'}, {'artist':'Stevie Wonder','song':'Superstition'}, {'artist':'Elton John','song':'Crocodile Rock'}, {'artist':'Roberta Flack','song':'Killing Me Softly With His Song'}, {'artist':'The O\'Jays','song':'Love Train'}, {'artist':'Vicki Lawrence','song':'The Night The Lights Went Out In Georgia'}, {'artist':'Dawn Featuring Tony Orlando','song':'Tie A Yellow Ribbon Round The Ole Oak Tree'}, {'artist':'Stevie Wonder','song':'You Are The Sunshine Of My Life'}, {'artist':'Edgar Winter Group','song':'Frankenstein'}, {'artist':'Wings','song':'My Love'}, {'artist':'George Harrison','song':'Give Me Love'}, {'artist':'Billy Preston','song':'Will It Go Round In Circles'}, {'artist':'Jim Croce','song':'Bad, Bad Leroy Brown'}, {'artist':'Maureen McGovern','song':'The Morning After'}, {'artist':'Diana Ross','song':'Touch Me In The Morning'}, {'artist':'Marvin Gaye','song':'Let\'s Get It On'}, {'artist':'Helen Reddy','song':'Delta Dawn'}, {'artist':'Grand Funk','song':'We\'re An American Band'}, {'artist':'The Rolling Stones','song':'Angie'}, {'artist':'Gladys Knight And The Pips','song':'Midnight Train To Georgia'}, {'artist':'Eddie Kendricks','song':'Keep On Truckin'}, {'artist':'Ringo Starr','song':'Photograph'}, {'artist':'Carpenters','song':'Top Of The World'}, {'artist':'Charlie Rich','song':'The Most Beautiful Girl'}, {'artist':'Jim Croce','song':'Time In A Bottle'} ];
        break;
      case 'custom-bilboard-1974':
        theData = [ {'artist':'Jim Croce','song':'Time In A Bottle'}, {'artist':'The Steve Miller Band','song':'The Joker'}, {'artist':'Al Wilson','song':'Show And Tell'}, {'artist':'Ringo Starr','song':'You\'re Sixteen'}, {'artist':'Barbra Streisand','song':'The Way We Were'}, {'artist':'Love Unlimited Orchestra','song':'Love\'s Theme'}, {'artist':'Terry Jacks','song':'Seasons In The Sun'}, {'artist':'Cher','song':'Dark Lady'}, {'artist':'John Denver','song':'Sunshine On My Shoulders'}, {'artist':'Blue Swede','song':'Hooked On A Feeling'}, {'artist':'Elton John','song':'Bennie And The Jets'}, {'artist':'MFSB','song':'The Sound Of Philadelphia'}, {'artist':'Grand Funk','song':'The Loco-Motion'}, {'artist':'Ray Stevens','song':'The Streak'}, {'artist':'Paul McCartney %26 Wings','song':'Band On The Run'}, {'artist':'Bo Donaldson And The Heywoods','song':'Billy, Don\'t Be A Hero'}, {'artist':'Gordon Lightfoot','song':'Sundown'}, {'artist':'The Hues Corporation','song':'Rock The Boat'}, {'artist':'George McCrae','song':'Rock Your Baby'}, {'artist':'John Denver','song':'Annie\'s Song'}, {'artist':'Roberta Flack','song':'Feel Like Makin\' Love'}, {'artist':'Paper Lace','song':'The Night Chicago Died'}, {'artist':'MFSB','song':'The Sound Of Philadelphia'}, {'artist':'Eric Clapton','song':'I Shot The Sheriff'}, {'artist':'Barry White','song':'Can\'t Get Enough Of Your Love, Babe'}, {'artist':'Andy Kim','song':'Rock Me Gently'}, {'artist':'Olivia Newton-John','song':'I Honestly Love You'}, {'artist':'Billy Preston','song':'Nothing From Nothing'}, {'artist':'Dionne Warwicke %26 Spinners','song':'Then Came You '}, {'artist':'Stevie Wonder','song':'You Haven\'t Done Nothin'}, {'artist':'Bachman-Turner Overdrive','song':'You Ain\'t Seen Nothing Yet'}, {'artist':'John Lennon ','song':'Whatever Gets You Thru The Night'}, {'artist':'Billy Swan','song':'I Can Help'}, {'artist':'Carl Douglas','song':'Kung Fu Fighting'}, {'artist':'Harry Chapin','song':'Cat\'s In The Cradle'}, {'artist':'Helen Reddy','song':'Angie Baby'} ];
        break;
      case 'custom-bilboard-1975':
        theData = [ {'artist':'Elton John','song':'Lucy In The Sky With Diamonds'}, {'artist':'Barry Manilow','song':'Mandy'}, {'artist':'Carpenters','song':'Please Mr. Postman'}, {'artist':'Neil Sedaka','song':'Laughter In The Rain'}, {'artist':'Ohio Players','song':'Fire'}, {'artist':'You\'re No Good','song':'Linda Ronstadt'}, {'artist':'AWB','song':'Pick Up The Pieces'}, {'artist':'Eagles','song':'Best Of My Love'}, {'artist':'Olivia Newton-John','song':'Have You Never Been Mellow'}, {'artist':'The Doobie Brothers','song':'Black Water'}, {'artist':'Frankie Valli','song':'My Eyes Adored You'}, {'artist':'Labelle','song':'Lady Marmalade'}, {'artist':'Minnie Riperton','song':'Lovin\' You'}, {'artist':'Elton John','song':'Philadelphia Freedom'}, {'artist':'B.J. Thomas','song':'Another Somebody Done Somebody Wrong Song'}, {'artist':'Tony Orlando','song':'He Don\'t Love You'}, {'artist':'Jackson','song':'Shining Star'}, {'artist':'Earth, Wind %26 Fire','song':'ABC'}, {'artist':'Freddy Fender','song':'Before The Next Teardrop Falls'}, {'artist':'John Denver','song':'Thank God I\'m A Country Boy'}, {'artist':'America','song':'Sister Golden Hair'}, {'artist':'Tennille','song':'Love Will Keep Us Together'}, {'artist':'Wings','song':'Listen To What The Man Said'}, {'artist':'Van McCoy The Soul City Symphony','song':'The Hustle'}, {'artist':'Eagles','song':'One Of These Nights'}, {'artist':'Bee Gees','song':'Jive Talkin\''}, {'artist':'Hamilton, Joe Frank %26 Reynolds','song':'Fallin\' In Love'}, {'artist':'KC And The Sunshine Band','song':'Get Down Tonight'}, {'artist':'Glen Campbell','song':'Rhinestone Cowboy'}, {'artist':'David Bowie','song':'Fame'}, {'artist':'John Denver','song':'I\'m Sorry'}, {'artist':'Neil Sedaka','song':'Bad Blood'}, {'artist':'Elton John','song':'Island Girl'}, {'artist':'KC And The Sunshine Band','song':'That\'s The Way'}, {'artist':'Silver Convention','song':'Fly, Robin, Fly'}, {'artist':'The Staple Singers','song':'Let\'s Do It Again'} ];
        break;
      case 'custom-bilboard-1976':
        theData = [ {'artist':'Bay City Rollers','song':'Saturday Night'}, {'artist':'C.W. McCall','song':'Convoy'}, {'artist':'Barry Manilow','song':'I Write The Songs'}, {'artist':'Diana Ross','song':'Theme From Mahogany'}, {'artist':'Ohio Players','song':'Love Rollercoaster'}, {'artist':'Paul Simon','song':'50 Ways To Leave Your Lover'}, {'artist':'Rhythm Heritage','song':'Theme From S.W.A.T.'}, {'artist':'The Miracles','song':'Love Machine'}, {'artist':'The 4 Seasons','song':'Oh, What a Night'}, {'artist':'Johnnie Taylor','song':'Disco Lady'}, {'artist':'Bellamy Brothers','song':'Let Your Love Flow'}, {'artist':'John Sebastian','song':'Welcome Back'}, {'artist':'The Sylvers','song':'Boogie Fever'}, {'artist':'Wings','song':'Silly Love Songs'}, {'artist':'Diana Ross','song':'Love Hangover'}, {'artist':'Starland Vocal Band','song':'Afternoon Delight'}, {'artist':'The Manhattans','song':'Kiss And Say Goodbye'}, {'artist':'Elton John','song':'Don\'t Go Breaking My Heart'}, {'artist':'Bee Gees','song':'You Should Be Dancing'}, {'artist':'KC And The Sunshine Band','song':'Shake Your Booty'}, {'artist':'Wild Cherry','song':'Play That Funky Music'}, {'artist':'Walter Murphy','song':'A Fifth Of Beethoven'}, {'artist':'Rick Dees','song':'Disco Duck'}, {'artist':'Chicago','song':'If You Leave Me Now'}, {'artist':'Steve Miller','song':'Rock\'n Me'}, {'artist':'Rod Stewart','song':'Tonight\'s The Night'} ];
        break;
      case 'custom-bilboard-1977':
        theData = [ {'artist':'Rod Stewart','song':'Tonight\'s The Night'}, {'artist':'Marilyn McCoo','song':'You Don\'t Have To Be A Star'}, {'artist':'Leo Sayer','song':'You Make Me Feel Like Dancing'}, {'artist':'I Wish','song':'Stevie Wonder'}, {'artist':'Rose Royce','song':'Car Wash'}, {'artist':'Mary Macgregor','song':'Torn Between Two Lovers'}, {'artist':'Manfred Mann','song':'Blinded By The Light'}, {'artist':'Eagles','song':'New Kid In Town'}, {'artist':'Barbra Streisand','song':'Evergreen'}, {'artist':'Daryl Hall John Oates','song':'Rich Girl'}, {'artist':'ABBA','song':'Dancing Queen'}, {'artist':'David Soul','song':'Don\'t Give Up On Us'}, {'artist':'Thelma Houston','song':'Don\'t Leave Me This Way'}, {'artist':'Glen Campbell','song':'Southern Nights'}, {'artist':'Eagles','song':'Hotel California'}, {'artist':'Leo Sayer','song':'When I Need You'}, {'artist':'Stevie Wonder','song':'Sir Duke'}, {'artist':'KC And The Sunshine Band','song':'I\'m Your Boogie Man'}, {'artist':'Fleetwood Mac','song':'You'}, {'artist':'Leo','song':'Dreams'}, {'artist':'Marvin Gaye','song':'Got To Give It Up'}, {'artist':'Bill Conti','song':'Gonna Fly Now'}, {'artist':'Alan O\'Day','song':'Undercover Angel'}, {'artist':'Shaun Cassidy','song':'Da Doo Ron Ron'}, {'artist':'Barry Manilow','song':'Looks Like We Made It'}, {'artist':'Andy Gibb','song':'I Just Want To Be Your Everything'}, {'artist':'The Emotions','song':'Best Of My Love'}, {'artist':'Meco','song':'Star Wars Theme'}, {'artist':'Debby Boone','song':'You Light Up My Life'}, {'artist':'Bee Gees','song':'How Deep Is Your Love'} ];
        break;
      case 'custom-bilboard-1978':
        theData = [ {'artist':'Bee Gees','song':'How Deep Is Your Love'}, {'artist':'Player','song':'Baby Come Back'}, {'artist':'Bee Gees','song':'Stayin\' Alive'}, {'artist':'Andy Gibb','song':'Thicker Than Water'}, {'artist':'Bee Gees','song':'Night Fever'}, {'artist':'Yvonne Elliman','song':'If I Can\'t Have You'}, {'artist':'Wings','song':'With A Little Luck'}, {'artist':'Johnny Mathis','song':'Too Much, Too Little, Too Late'}, {'artist':'John Travolta','song':'You\'re The One That I Want'}, {'artist':'Andy Gibb','song':'Shadow Dancing'}, {'artist':'The Rolling Stones','song':'Miss You'}, {'artist':'Commodores','song':'Three Times A Lady'}, {'artist':'Frankie Valli','song':'Grease'}, {'artist':'A Taste Of Honey','song':'Boogie Oogie Oogie'}, {'artist':'Exile','song':'Kiss You All Over'}, {'artist':'Nick Gilder','song':'Hot Child In The City'}, {'artist':'Anne Murray','song':'You Needed Me'}, {'artist':'Donna Summer','song':'MacArthur Park'}, {'artist':'Barbra Streisand','song':'You Don\'t Bring Me Flowers'}, {'artist':'Chic','song':'Le Freak'} ];
        break;
      case 'custom-bilboard-1979':
        theData = [ {'artist':'Bee Gees','song':'Too Much Heaven'}, {'artist':'Chic','song':'Le Freak'}, {'artist':'Rod Stewart','song':'Da Ya Think I\'m Sexy?'}, {'artist':'Gloria Gaynor','song':'I Will Survive'}, {'artist':'Bee Gees','song':'Tragedy'}, {'artist':'The Doobie Brothers','song':'What A Fool Believes'}, {'artist':'Amii Stewart','song':'Knock On Wood'}, {'artist':'Blondie','song':'Heart Of Glass'}, {'artist':'Peaches','song':'Reunited'}, {'artist':'Donna Summer','song':'Hot Stuff'}, {'artist':'Bee Gees','song':'Love You Inside Out'}, {'artist':'Ring My Bell','song':'Anita Ward'}, {'artist':'Donna Summer','song':'Bad Girls'}, {'artist':'Chic','song':'Good Times'}, {'artist':'The Knack','song':'My Sharona'}, {'artist':'Robert John','song':'Sad Eyes'}, {'artist':'Michael Jackson','song':'Don\'t Stop \'Til You Get Enough'}, {'artist':'Herb Alpert','song':'Rise'}, {'artist':'M','song':'Pop Muzik'}, {'artist':'Eagles','song':'Heartache Tonight'}, {'artist':'Commodores','song':'Still'}, {'artist':'Barbra Streisand','song':'No More Tears'}, {'artist':'Styx','song':'Babe'}, {'artist':'Rupert Holmes','song':'Escape'} ];
        break;
      case 'custom-bilboard-1980':
        theData = [{'artist':'KC and the Sunshine Band','song':'Please Don\'t Go'},{'artist':'Rupert Holmes','song':'Escape'},{'artist':'Michael Jackson','song':'Rock with You'},{'artist':'Do That to Me One More Time','song':'Captain Tennille'},{'artist':'Queen','song':'Crazy Little Thing Called Love'},{'artist':'Pink Floyd','song':'Another Brick in the Wall, Part II'},{'artist':'Blondie','song':'Call me'},{'artist':'Lipps Inc','song':'Funkytown'},{'artist':'Paul McCartney','song':'Coming Up'},{'artist':'Billy Joel','song':'"Still Rock and Roll to Me'},{'artist':'Olivia Newton-John','song':'Magic'},{'artist':'Christopher Cross','song':'Sailing'},{'artist':'Diana Ross','song':'Upside Down'},{'artist':'Queen','song':'Another One Bites the Dust'},{'artist':'Barbra Streisand','song':'Woman in Love'},{'artist':'Kenny Rogers','song':'Lady'},{'artist':'John Lennon','song':'Starting Over'}];
        break;
      case 'custom-bilboard-1981':
        theData = [{'artist':'John Lennon','song':'Starting Over'}, {'artist':'Blondie','song':'The Tide Is High'}, {'artist':'Kool the Gang','song':'Celebration'}, {'artist':'Dolly Parton','song':'9 to 5'}, {'artist':'Eddie Rabbitt','song':'Love a rainy night'}, {'artist':'REO Speedwagon','song':'keep on loving'}, {'artist':'Blondie','song':'Rapture'}, {'artist':'Daryl Hall John Oates','song':'kiss on my list'}, {'artist':'Sheena Easton','song':'morning train'}, {'artist':'Kim Carnes','song':'Bette Davis'}, {'artist':'Stars on 45','song':'Medley'}, {'artist':'Air Supply','song':'The one you love'}, {'artist':'Rick Springfield','song':'Jessie\'s Girl'}, {'artist':'Lionel Ritchie','song':'Endless Love'}, {'artist':'Christopher Cross','song':'Virgin'}, {'artist':'Madonna','song':'Arthur\'s Theme'}, {'artist':'Daryl Hall and John Oates','song':'Private Eyes'}, {'artist':'Olivia Newton-John','song':'Pysical'}];
        break;
      case 'custom-bilboard-1982':
        theData = [{'artist':'Olivia Newton-John','song':'Pysical'}, {'artist':'Daryl Hall and John Oates','song':'No Can Do'}, {'artist':'J. Geils Band','song':'Centerfold'}, {'artist':'Joan Jett and the Blackhearts','song':'Love rock Roll'}, {'artist':'Vangelis','song':'Chariots of Fire'}, {'artist':'Wonder','song':'"Ebony and Ivory'}, {'artist':'The Human League','song':'you want me'}, {'artist':'Survivor','song':'Eye of the Tiger'}, {'artist':'Steve Miller Band','song':'Abracadabra'}, {'artist':'Chicago','song':'Hard to Say I\'m Sorry'}, {'artist':'John Cougar','song':'Jack Diane'}, {'artist':'Men at Work','song':'Who can it be'}, {'artist':'cocker','song':'Up Where We Belong'}, {'artist':'Lionel Richie','song':'Truly'}, {'artist':'Toni Basil','song':'Mickey'}, {'artist':'Daryl Hall and John Oates','song':'Maneater'}];
        break;
      case 'custom-bilboard-1983':
        theData = [{'artist':'Daryl Hall and John Oates','song':'Maneater'}, {'artist':'Men at Work','song':'Down Under'}, {'artist':'Toto','song':'Africa'}, {'artist':'Patti Austin','song':'Come to me'}, {'artist':'Michael Jackson','song':'Billie'}, {'artist':'Dexys Midnight Runners','song':'Come On Eileen'}, {'artist':'Michael Jackson','song':'Beat it'}, {'artist':'David Bowie','song':'Let\'s Dance'}, {'artist':'Irene Cara','song':'Flashdance'}, {'artist':'The Police','song':'Every breath'}, {'artist':'Eurythmics','song':'Sweet Dreams'}, {'artist':'Michael Sembello','song':'Maniac'}, {'artist':'Billy Joel','song':'Tell Her About'}, {'artist':'Bonnie Tyler','song':'Total eclipse'}, {'artist':'Kenny Rogers','song':'Islands in the Stream'}, {'artist':'Lionel Richie','song':'All Night Long'}, {'artist':'Paul McCartney','song':'Say Say Say'}];
        break;
      case 'custom-bilboard-1984':
        theData = [ {'artist':'Paul McCartney','song':'Say Say Say'}, {'artist':'Yes','song':'Owner of a Lonely Heart'}, {'artist':'Culture Club','song':'Karma Chameleon'}, {'artist':'Van Halen','song':'Jump'}, {'artist':'Kenny Loggins','song':'Footloose'}, {'artist':'Phil Collins','song':'All Odds'}, {'artist':'Lionel Richie','song':'Hello'}, {'artist':'Deniece Williams','song':'hear it for the boy'}, {'artist':'Cyndi Lauper','song':'TIme after time'}, {'artist':'Duran Duran','song':'Reflex'}, {'artist':'Prince','song':'Doves Cry'}, {'artist':'Ray Parker','song':'Ghostbusters'}, {'artist':'Tina Turner','song':'Love got to do'}, {'artist':'John Waite','song':'Missing You'}, {'artist':'Prince','song':'Go Crazy'}, {'artist':'Stevie Wonder','song':'I Just Called'}, {'artist':'Billy Ocean','song':'Caribbean Queen'}, {'artist':'Wham!','song':'Wake Me Up'}, {'artist':'Daryl Hall and John Oates','song':'Out of Touch'}, {'artist':'Madonna','song':'Virgin'}];
        break;
      case 'custom-bilboard-1985':
        theData = [
          {'artist':'Madonna','song':'Like A Virgin'},{'artist':'Foreigner','song':'I Want To Know What Love Is'},{'artist':'Wham!','song':'Careless Whisper'},{'artist':'REO Speedwagon','song':'Can\'t Fight This Feeling'},{'artist':'Phil Collins','song':'One More Night'},{'artist':'USA For Africa','song':'We Are The World'},{'artist':'Madonna','song':'Crazy For You'},{'artist':'Simple Minds','song':'Forget About Me'},{'artist':'Wham!','song':'Everything She Wants'},{'artist':'Tears For Fears','song':'Everybody Wants To Rule The World'},{'artist':'Bryan Adams','song':'Heaven'},{'artist':'Phil Collins','song':'Sussudio'},{'artist':'Duran Duran','song':'A View To A Kill'},{'artist':'Paul Young','song':'Everytime You Go Away'},{'artist':'Tears For Fears','song':'Shout'},{'artist':'Huey Lewis','song':'The Power Of Love'},{'artist':'John Parr','song':'St. Elmo\'s Fire'},{'artist':'Dire Straits','song':'Money For Nothing'},{'artist':'Ready For The World','song':'Oh Sheila'},{'artist':'A-Ha','song':'Take On Me'},{'artist':'Whitney Houston','song':'Saving All My Love For You'},{'artist':'Stevie Wonder','song':'Kiss'},{'artist':'Prince','song':'Part-Time Lover'},{'artist':'Jan Hammer','song':'Miami Vice Theme'},{'artist':'Starship','song':'We Built This City'},{'artist':'Phil Collins','song':'Theme From White Nights'},{'artist':'Mr. Mister','song':'Broken Wings'},{'artist':'Lionel Richie','song':'Say You, Say Me'}];
          break;
      case 'custom-bilboard-1986':
        theData = [ {'artist':'Lionel Richie','song':'Say You, Say Me'}, {'artist':'Dionne','song':'What Friends Are For'}, {'artist':'Whitney Houston','song':'How Will I Know'}, {'artist':'Mr. Mister','song':'Kyrie'}, {'artist':'Starship','song':'Sara'}, {'artist':'Heart','song':'These Dreams'}, {'artist':'Falco','song':'Rock Me Amadeus'}, {'artist':'Prince','song':'Kiss'}, {'artist':'Robert Palmer','song':'Addicted To Love'}, {'artist':'Pet Shop Boys','song':'West End Girls'}, {'artist':'Whitney Houston','song':'Greatest Love Of All'}, {'artist':'Madonna','song':'Live To Tell'}, {'artist':'Patti LaBelle','song':'On My Own'}, {'artist':'Billy Ocean','song':'Be Sad Songs'}, {'artist':'Simply Red','song':'Holding Back The Years'}, {'artist':'Genesis','song':'Invisible Touch'}, {'artist':'Peter Gabriel','song':'Sledgehammer'}, {'artist':'Peter Cetera','song':'Glory Of Love'}, {'artist':'Madonna','song':'Papa Don\'t Preach'}, {'artist':'Steve Winwood','song':'Higher Love'}, {'artist':'Bananarama','song':'Venus'}, {'artist':'Berlin','song':'Take My Breath Away'}, {'artist':'Huey Lewis','song':'Stuck With You'}, {'artist':'Janet Jackson','song':'When I Think Of You'}, {'artist':'Cyndi Lauper','song':'True Colors'}, {'artist':'Boston','song':'Amanda'}, {'artist':'Human League','song':'Human'}, {'artist':'Bon Jovi','song':'You Give Love A Bad Name'}, {'artist':'Peter Cetera','song':'The Next Time I Fall'}, {'artist':'Bruce Hornsby','song':'The Way It Is'}, {'artist':'Bangles','song':'Walk Like An Egyptian'} ];
        break;
      case 'custom-bilboard-1987':
        theData = [ {'artist':'Bangles','song':'Walk Like An Egyptian'}, {'artist':'Gregory Abbott','song':'Shake You Down'}, {'artist':'Billy Vera','song':'At This Moment'}, {'artist':'Madonna','song':'Open Your Heart'}, {'artist':'Bon Jovi','song':'Livin On A Prayer'}, {'artist':'Huey Lewis','song':'Jacob\'s Ladder'}, {'artist':'Club Nouveau','song':'Lean On Me'}, {'artist':'Starship','song':'Gonna Stop Us Now'}, {'artist':'Aretha Franklin','song':'I Knew You Were Waiting'}, {'artist':'Cutting Crew','song':'Died In Your Arms'}, {'artist':'U2','song':'With Or Without You'}, {'artist':'Kim Wilde','song':'You Keep Me Hangin On'}, {'artist':'Atlantic Starr','song':'Always'}, {'artist':'Lisa Lisa','song':'Head To Toe'}, {'artist':'Whitney Houston','song':'I Wanna Dance With Somebody'}, {'artist':'Heart','song':'Alone'}, {'artist':'Bob Seger','song':'Shakedown'}, {'artist':'U2','song':'Found What I\'m Looking For'}, {'artist':'Madonna','song':'Who\'s That Girl'}, {'artist':'Los Lobos','song':'La Bamba'}, {'artist':'Michael Jackson','song':'Stop Loving You'}, {'artist':'Whitney Houston','song':'We Almost Have It All'}, {'Whitesnake':'George','song':'Here I Go Again'}, {'artist':'Lisa Lisa %26 Cult Jam','song':'Lost In Emotion'}, {'artist':'Michael Jackson','song':'Bad'}, {'artist':'Tiffany','song':'I Think We\'re Alone Now'}, {'artist':'Billy Idol','song':'Mony Mony'}, {'artist':'Bill Medley','song':'The Time Of My Life'}, {'artist':'Belinda Carlisle','song':'Heaven Is A Place On Earth'}, {'artist':'George Michael','song':'Faith'} ];
        break;
      case 'custom-bilboard-1988':
        theData = [ {'artist':'George Michael','song':'Faith'}, {'artist':'Whitney Houston','song':'So Emotional'}, {'artist':'George Harrison','song':'Got My Mind Set On You'}, {'artist':'Michael Jackson','song':'The Way You Make Me Feel'}, {'artist':'INXS','song':'Need You Tonight'}, {'artist':'Tiffany','song':'Could\'ve Been'}, {'artist':'Expose','song':'Seasons Change'}, {'artist':'George Michael','song':'Father Figure'}, {'artist':'Rick Astley','song':'Never Gonna Give You Up'}, {'artist':'Michael Jackson','song':'Man In The Mirror'}, {'artist':'Billy Ocean','song':'Get Outta My Dreams, Get Into My Car'}, {'artist':'Whitney Houston','song':'Where Do Broken Hearts Go'}, {'artist':'Terence Trent','song':'Wishing Well'}, {'artist':'Gloria Estefan','song':'Anything For You'}, {'artist':'George Michael','song':'One More Try'}, {'artist':'Rick Astley','song':'Together Forever'}, {'artist':'Debbie Gibson','song':'Foolish Beat'}, {'artist':'Michael Jackson','song':'Dirty Diana'}, {'artist':'Cheap Trick','song':'The Flame'}, {'artist':'Richard Marx','song':'Hold On To The Nights'}, {'artist':'Steve Winwood','song':'Roll With It'}, {'artist':'George Michael','song':'Monkey'}, {'artist':'Sweet Child O Mine','song':'Guns Roses'}, {'artist':'Bobby McFerrin','song':'Don\'t Worry, Be Happy'}, {'artist':'Def Leppard','song':'Love Bites'}, {'artist':'UB40','song':'Red Red Wine'}, {'artist':'Phil Collins','song':'Groovy Kind Of Love'}, {'artist':'Beach Boys','song':'Kokomo'}, {'artist':'Escape Club','song':'Wild, Wild West'}, {'artist':'Bon Jovi','song':'Bad Medicine'}, {'artist':'Chicago','song':'Look Away'}, {'artist':'Poison','song':'Every Rose Has Its Thorn'}, {'artist':'Freebird Medley','song':'Baby, I Love Your Way'} ];
        break;
      case 'custom-bilboard-1989':
        theData = [ {'artist':'Poison','song':'Every Rose Has Its Thorn'}, {'artist':'Bobby Brown','song':'My Prerogative'}, {'artist':'Phil Collins','song':'Two Hearts'}, {'artist':'Sheriff','song':'When I\'m With You'}, {'artist':'Paula Abdul','song':'Straight Up'}, {'artist':'Debbie Gibson','song':'Lost In Your Eyes'}, {'artist':'Mike Mechanics','song':'The Living Years'}, {'artist':'Bangles','song':'Eternal Flame'}, {'artist':'Roxette','song':'The Look'}, {'artist':'Fine Young Cannibals','song':'She Drives Me Crazy'}, {'artist':'Madonna','song':'Like A Prayer'}, {'artist':'Bon Jovi','song':'I\'ll Be There For You'}, {'artist':'Paula Abdul','song':'Forever Your Girl'}, {'artist':'Michael Damian','song':'Rock On'}, {'artist':'Bette Midler','song':'Wind Beneath My Wings'}, {'artist':'New Kids On The Block','song':'I\'ll Be Loving You'}, {'artist':'Richard Marx','song':'Satisfied'}, {'artist':'Milli Vanilli','song':'Forget My Number'}, {'artist':'Fine Young Cannibals','song':'Good Thing'}, {'artist':'Simply Red','song':'Know Me By Now'}, {'artist':'Martika','song':'Toy Soldiers'}, {'artist':'Richard Marx','song':'Right Here Waiting'}, {'artist':'Paula Abdul','song':'Cold Hearted'}, {'artist':'New Kids On The Block','song':'Hangin Tough'}, {'artist':'Gloria Estefan','song':'Wanna Lose You'}, {'artist':'Milli Vanilli','song':'Gonna Miss You'}, {'artist':'Janet Jackson','song':'Miss You Much'}, {'artist':'Roxette','song':'Listen To Your Heart'}, {'artist':'Bad English','song':'When I See You Smile'}, {'artist':'Billy Joel','song':'We Didn t Start The Fire'}, {'artist':'Phil Collins','song':'Another Day In Paradise'} ];
        break;
      case 'custom-bilboard-1990':
        theData = [{'artist':'Phil Collins','song':'Another Day In Paradise'},{'artist':'Michael Bolton','song':'How Am I Supposed To Live Without You'},{'artist':'Paula Abdul','song':'Opposites Attract'},{'artist':'Janet Jackson','song':'Escapade'},{'artist':'Alannah Myles','song':'Black Velvet'},{'artist':'Taylor Dayne','song':'Love Will Lead You Back'},{'artist':'Tommy Page','song':'I\'ll Be Your Everything'},{'artist':'Sinead O\'Connor','song':'Nothing Compares 2 U'},{'artist':'Madonna','song':'Vogue'},{'artist':'Wilson Phillips','song':'Hold On'},{'artist':'Roxette','song':'It Must Have Been Love'},{'artist':'New Kids On The Block','song':'Step By Step'},{'artist':'Glenn Medeiros','song':'She Ain\'t Worth It'},{'artist':'Mariah Carey','song':'Vision Of Love '},{'artist':'Sweet Sensation','song':'If Wishes Came True'},{'artist':'Bon Jovi','song':'Blaze Of Glory'},{'artist':'Wilson Phillips','song':'Release Me'},{'artist':'Nelson','song':'Love And Affection'},{'artist':'Maxi Priest','song':'Close To You'},{'artist':'Praying For Time','song':'George Michael'},{'artist':'I Don\'t Have The Heart','song':'James Ingram'},{'artist':'Black Cat','song':'Janet Jackson'},{'artist':'Ice Ice Baby','song':'Vanilla Ice'},{'artist':'Love Takes Time','song':'Mariah Carey'},{'artist':'Your Baby Tonight','song':'Whitney Houston'},{'artist':'Stevie B','song':'Because I Love You'}];
        break;
      case 'custom-bilboard-1991':
        theData = [{'artist':'Madonna','song':'Justify My Love'},{'artist':'Michael Bolton','song':'How Am I Supposed To Live Without You'},{'artist':'Janet Jackson','song':'Love Will Never Do'}, {'artist':'Surface','song':'The First Time'}, {'artist':'C+C Music Factory','song':'Gonna Make You Sweat'}, {'artist':'Whitney Houston','song':'All The Man That I Need'}, {'artist':'Mariah Carey','song':'Someday'}, {'artist':'Timmy T.','song':'One More Try'}, {'artist':'Gloria Estefan','song':'Coming Out Of The Dark'}, {'artist':'Londonbeat','song':'Been Thinking About You'}, {'artist':'Wilson Phillips','song':'You\'re In Love '}, {'artist':'Amy Grant','song':'Baby Baby'}, {'artist':'Roxette','song':'Joyride'}, {'artist':'Hi-Five','song':'I Like The Way'}, {'artist':'Mariah Carey','song':'I Don\'t Wanna Cry'}, {'artist':'Extreme','song':'More Than Words'}, {'artist':'Paula Abdul','song':'Rush Rush'},{'artist':'EMF','song':'Unbelievable'},{'artist':'Bryan Adams','song':'Everything I Do) I Do It For You'},{'artist':'Paula Abdul','song':'The Promise of a New Day '},{'artist':'Color Me Badd','song':'I Adore Mi Amor'},{'artist':'Marky Mark','song':'Good Vibrations'},{'artist':'Mariah Carey','song':'Emotions'},{'artist':'Karyn White','song':'Romantic'},{'artist':'Prince','song':'Cream'},{'artist':'Michael Bolton','song':'When A Man Loves A Woman'},{'artist':'Bryan Adams','song':'Can\'t Stop This Thing We Started'},{'artist':'CeCe Peniston','song':'Finally'},{'artist':'Michael Jackson','song':'Black or White'} ];
        break;
      case 'custom-bilboard-1992':
        theData = [ {'artist':'Michael Jackson','song':'Black Or White'}, {'artist':'Color Me Badd','song':'All 4 Love'}, {'artist':'George Michael','song':'Don\'t Let The Sun Go Down On Me'}, {'artist':'Too Sexy','song':'Right Said Fred'}, {'artist':'Mr. Big','song':'To Be With You'}, {'artist':'Vanessa Williams','song':'Save The Best For Last'}, {'artist':'Kris Kross','song':'Jump'}, {'artist':'Mariah Carey','song':'I\'ll Be There'}, {'artist':'Sir Mix-A-Lot','song':'Baby Got Back'}, {'artist':'Madonna','song':'This Used To Be My Playground'}, {'artist':'Boyz II Men','song':'End Of The Road'}, {'artist':'The Heights','song':'How Do You Talk To An Angel'}, {'artist':'Whitney Houston','song':'I Will Always Love You'} ];
        break;
      case 'custom-bilboard-1993':
        theData = [ {'artist':'Whitney Houston','song':'I Will Always Love You'}, {'artist':'Peabo Bryson','song':'A Whole New World'}, {'artist':'Snow','song':'Informer'}, {'artist':'Silk','song':'Freak Me'}, {'artist':'Janet Jackson','song':'That\'s The Way Love Goes'}, {'artist':'SWV','song':'Weak'}, {'artist':'UB40','song':'Can\'t Help Falling In Love'}, {'artist':'Mariah Carey','song':'Dreamlover'}, {'artist':'Meat Loaf','song':'I\'d Do Anything For Love'}, {'artist':'Janet Jackson','song':'Again'}, {'artist':'Mariah Carey','song':'Hero'} ];
        break;
      case 'custom-bilboard-1994':
        theData = [ {'artist':'Mariah Carey','song':'Hero'}, {'artist':'Bryan Adams','song':'All For Love'}, {'artist':'Celine Dion','song':'The Power Of Love'}, {'artist':'Ace Of Base','song':'The Sign'}, {'artist':'R. Kelly','song':'Bump N Grind'}, {'artist':'All-4-One','song':'I Swear'}, {'artist':'Lisa Loeb','song':'Stay'}, {'artist':'Boyz II Men','song':'I\'ll Make Love To You'}, {'artist':'Boyz II Men','song':'On Bended Knee'}, {'artist':'Ini Kamoze','song':'Here Comes The Hotstepper'} ];
        break;
      case 'custom-bilboard-1995':
        theData = [ {'artist':'Boyz II Men','song':'On Bended Knee'}, {'artist':'TLC','song':'Creep'}, {'artist':'Madonna','song':'Take A Bow'}, {'artist':'Montell Jordan','song':'This Is How We Do It'}, {'artist':'Bryan Adams','song':'Have You Ever Really Loved A Woman?'}, {'artist':'TLC','song':'Waterfalls'}, {'artist':'Seal','song':'Kiss From A Rose'}, {'artist':'Michael Jackson','song':'You Are Not Alone'}, {'artist':'Coolio','song':'Gangsta\'s Paradise'}, {'artist':'Mariah Carey','song':'Fantasy'}, {'artist':'Whitney Houston','song':'Exhale'}, {'artist':'Mariah Carey','song':'One Sweet Day'} ];
        break;
      case 'custom-bilboard-1996':
        theData = [ {'artist':'Mariah Carey','song':'One Sweet Day'}, {'artist':'Celine Dion','song':'Because You Loved Me'}, {'artist':'Mariah Carey','song':'Always Be My Baby'}, {'artist':'Bone Thugs-N-Harmony','song':'Tha Crossroads'}, {'artist':'2Pac','song':'How Do U Want It'}, {'artist':'Toni Braxton','song':'You\'re Makin\' Me High'}, {'artist':'Los Del Rio','song':'Macarena'}, {'artist':'BLACKstreet','song':'No Diggity'}, {'artist':'Toni Braxton','song':'Un-Break My Heart'} ];
        break;
      case 'custom-bilboard-1997':
        theData = [ {'artist':'Toni Braxton','song':'Un-Break My Heart'}, {'artist':'Spice Girls','song':'Wannabe'}, {'artist':'Puff Daddy','song':'Can\'t Nobody Hold Me Down'}, {'artist':'The Notorious B.I.G.','song':'Hypnotize'}, {'artist':'Hanson','song':'Mmmbop'}, {'artist':'Puff Daddy','song':'I\'ll Be Missing You'}, {'artist':'The Notorious B.I.G.','song':'Mo Money Mo Problems'}, {'artist':'Mariah Carey','song':'Honey'}, {'artist':'Boyz II Men','song':'4 Seasons Of Loneliness'}, {'artist':'Elton John','song':'Candle In The Wind'} ];
        break;
      case 'custom-bilboard-1998':
        theData = [ {'artist':'Elton John','song':'Candle In The Wind'}, {'artist':'Savage Garden','song':'Truly Madly Deeply'}, {'artist':'Janet','song':'Together Again'}, {'artist':'Usher','song':'Nice %26 Slow'}, {'artist':'Celine Dion','song':'My Heart Will Go On'}, {'artist':'Will Smith','song':'Gettin\' Jiggy Wit It'}, {'artist':'K-Ci %26 JoJo','song':'All My Life'}, {'artist':'Next','song':'Too Close'}, {'artist':'Mariah Carey','song':'My All'}, {'artist':'Brandy','song':'The Boy Is Mine'}, {'artist':'Aerosmith','song':'I Don\'t Want To Miss A Thing'}, {'artist':'Monica','song':'The First Night'}, {'artist':'Barenaked Ladies','song':'One Week'}, {'artist':'Lauryn Hill','song':'Doo Wop'}, {'artist':'Divine','song':'Lately'}, {'artist':'R. Kelly','song':'I\'m Your Angel'} ];
        break;
      case 'custom-bilboard-1999':
        theData = [ {'artist':'R. Kelly','song':'I\'m Your Angel'}, {'artist':'Brandy','song':'Have You Ever?'}, {'artist':'Britney Spears','song':'Baby One More Time'}, {'artist':'Monica','song':'Angel Of Mine'}, {'artist':'Cher','song':'Believe'}, {'artist':'TLC','song':'No Scrubs'}, {'artist':'Ricky Martin','song':'Livin La Vida Loca'}, {'artist':'Jennifer Lopez','song':'If You Had My Love'}, {'artist':'Destiny\'s Child','song':'Bills, Bills, Bills'}, {'artist':'Will Smith','song':'Wild Wild West'}, {'artist':'Christina Aguilera','song':'Genie In A Bottle'}, {'artist':'Enrique Iglesias','song':'Bailamos'}, {'artist':'TLC','song':'Unpretty'}, {'artist':'Mariah Carey','song':'Heartbreaker'}, {'artist':'Santana','song':'Smooth'} ];
        break;

      case 'custom-bilboard-2000':
        theData = [{'artist':'Faith Hill','song':'Breathe'},{'artist':'Santana','song':'Smooth'},{'artist':'Maria Maria','song':'Santana featuring The Product'},{'artist':'Vertical Horizon','song':'Everything you want'},{'artist':'Destinys Child','song':'Say My Name'},{'artist':'Savage Garden','song':'I Knew I Loved You'},{'artist':'Lonestar','song':'Amazed'},{'artist':'Matchbox Twenty','song':'Bent'},{'artist':'Toni Braxton','song':'Man Enough'},{'artist':'Creed','song':'Higher'},{'artist':'Aaliyah','song':'Try Again'},{'artist':'Destiny','song':'Jumpin'},{'artist':'Sisqó','song':'Thong Song'},{'artist':'3 Doors Down','song':'Kryptonite'},{'artist':'Pink','song':'There You Go'},{'artist':'Madonna','song':'Music'},{'artist':'Montell Jordan','song':'Get It On Tonite'},{'artist':'Marc Anthony','song':'I Need to Know'},{'artist':'Christina Aguilera','song':'What a Girl Wants'}];
        break;

      case 'custom-bilboard-2001':
        theData = [{'artist':'Lifehouse','song':'Hanging by a Moment'},{'artist':'Alicia Keys','song':'Fallin'},{'artist':'Janet','song':'All for You'},{'artist':'Train','song':'Drops of Jupiter'},{'artist':'Jennifer Lopez','song':'I\'m Real'},{'artist':'Matchbox Twenty','song':'If You\'re Gone'},{'artist':'Eve','song':'Let Me Blow Ya Mind'},{'artist':'Dido','song':'Thank You'},{'artist':'Lenny Kravitz','song':'Again'},{'artist':'Destiny\'s Child','song':'Independent Women'},{'artist':'Blu Cantrell','song':'Hit \'Em Up Style'},{'artist':'Shaggy','song':'It Wasn\'t Me'},{'artist':'Joe','song':'Stutter'},{'artist':'Staind','song':'Been Awhile'},{'artist':'Usher','song':'U Remind Me'},{'artist':'Jagged Edge ','song':'Where the Party At'},{'artist':'Shaggy','song':'Angel'},{'artist':'Nelly','song':'Ride wit Me'},{'artist':'Uncle Kracker','song':'Follow Me'},{'artist':'112','song':'Peaches %26 Cream'},{'artist':'Incubus','song':'Drive'}];
        break;

      case 'custom-bilboard-2002':
        theData = [ {'artist':'How You Remind Me','song':'Nickelback'}, {'artist':'U Got It Bad','song':'Usher'}, {'artist':'Always on Time','song':'Ja Rule featuring Ashanti'}, {'artist':'Ain\'t It Funny','song':'Jennifer Lopez featuring Ja Rule'}, {'artist':'Foolish','song':'Ashanti'}, {'artist':'Hot in Herre','song':'Nelly'}, {'artist':'Dilemma','song':'Nelly featuring Kelly Rowland'}, {'artist':'A Moment Like This','song':'Kelly Clarkson'}, {'artist':'Lose Yourself','song':'Eminem'} ];
        break;

      case 'custom-bilboard-2003':
        theData = [ {'artist':'Bump, Bump, Bump','song':'B2K'}, {'artist':'All I Have','song':'Jennifer Lopez'}, {'artist':'In Da Club','song':'50 Cent'}, {'artist':'Get Busy','song':'Sean Paul'}, {'artist':'21 Questions','song':'50 Cent'}, {'artist':'This Is the Night','song':'Clay Aiken'}, {'artist':'Crazy in Love','song':'Beyoncé featuring Jay-Z'}, {'artist':'Shake Ya Tailfeather','song':'Nelly, P. Diddy and Murphy Lee'}, {'artist':'Baby Boy','song':'Beyoncé featuring Sean Paul'}, {'artist':'Stand Up','song':'Ludacris featuring Shawnna'}, {'artist':'Hey Ya!','song':'OutKast'} ];
        break;

      case 'custom-bilboard-2004':
        theData = [ {'song':'Hey Ya!','artist':'OutKast'}, {'song':'The Way You Move','artist':'OutKast featuring Sleepy Brown'}, {'song':'Slow Jamz','artist':'Twista featuring Kanye West and Jamie Foxx'}, {'song':'Yeah!','artist':'Usher featuring Lil Jon and Ludacris'}, {'song':'I Believe','artist':'Fantasia'}, {'song':'Burn','artist':'Usher'}, {'song':'Confessions Part II','artist':'Usher'}, {'song':'Slow Motion','artist':'Juvenile featuring Soulja Slim'}, {'song':'Lean Back','artist':'Terror Squad'}, {'song':'Goodies','artist':'Ciara featuring Petey Pablo'}, {'song':'My Boo','artist':'Usher and Alicia Keys'}, {'song':'Drop It Like It\'s Hot','artist':'Snoop Dogg featuring Pharrell'} ];
        break;

      case 'custom-bilboard-2004':
        theData = [ {'song':'Hey Ya!','artist':'OutKast'}, {'song':'The Way You Move','artist':'OutKast featuring Sleepy Brown'}, {'song':'Slow Jamz','artist':'Twista featuring Kanye West and Jamie Foxx'}, {'song':'Yeah!','artist':'Usher featuring Lil Jon and Ludacris'}, {'song':'I Believe','artist':'Fantasia'}, {'song':'Burn','artist':'Usher'}, {'song':'Confessions Part II','artist':'Usher'}, {'song':'Slow Motion','artist':'Juvenile featuring Soulja Slim'}, {'song':'Lean Back','artist':'Terror Squad'}, {'song':'Goodies','artist':'Ciara featuring Petey Pablo'}, {'song':'My Boo','artist':'Usher and Alicia Keys'}, {'song':'Drop It Like It\'s Hot','artist':'Snoop Dogg featuring Pharrell'} ];
        break;

      case 'custom-bilboard-2005':
        theData = [ {'song':'Let Me Love You','artist':'Mario'}, {'song':'Candy Shop','artist':'50 Cent featuring Olivia'}, {'song':'Hollaback Girl','artist':'Gwen Stefani'}, {'song':'We Belong Together','artist':'Mariah Carey'}, {'song':'Inside Your Heaven','artist':'Carrie Underwood'}, {'song':'Gold Digger','artist':'Kanye West featuring Jamie Foxx'}, {'song':'Run It!','artist':'Chris Brown'}, {'song':'Don\'t Forget About Us','artist':'Mariah Carey'} ];
        break;

      case 'custom-bilboard-2006':
        theData = [ {'song':'Don\'t Forget About Us','artist':'Mariah Carey'}, {'song':'"Laffy Taffy','artist':'D4L'}, {'song':'Grillz','artist':'Nelly featuring Paul Wall, Ali'}, {'song':'Check on It','artist':'Beyoncé featuring Slim Thug'}, {'song':'You\'re Beautiful','artist':'James Blunt'}, {'song':'So Sick','artist':'Ne-Yo'}, {'song':'Temperature','artist':'Sean Paul'}, {'song':'Bad Day','artist':'dagger Daniel Powter'}, {'song':'SOS','artist':'Rihanna'}, {'song':'Ridin','artist':'Chamillionaire featuring Krayzie Bone'}, {'song':'Hips Don\'t Lie','artist':'Shakira featuring Wyclef Jean'}, {'song':'Do I Make You Proud','artist':'Taylor Hicks'}, {'song':'Promiscuous','artist':'Nelly Furtado featuring Timbaland'}, {'song':'London Bridge','artist':'Fergie'}, {'song':'SexyBack','artist':'Justin Timberlake'}, {'song':'Money Maker','artist':'Ludacris featuring Pharrell'}, {'song':'My Love','artist':'Justin Timberlake featuring T.I.'}, {'song':'I Wanna Love You','artist':'Akon featuring Snoop Dogg'}, {'song':'Irreplaceable','artist':'Beyoncé'} ];
        break;

      case 'custom-bilboard-2007':
        theData = [ {'song':'Irreplaceable','artist':'Beyoncé'}, {'song':'Say It Right','artist':'Nelly Furtado'}, {'song':'What Goes Around...Comes Around','artist':'Justin Timberlake'}, {'song':'This Is Why I\'m Hot','artist':'Mims'}, {'song':'Glamorous','artist':'Fergie featuring Ludacris'}, {'song':'Don\'t Matter','artist':'Akon'}, {'song':'Give It to Me','artist':'Timbaland featuring Nelly Furtado and Justin Timberlake'}, {'song':'Girlfriend','artist':'Avril Lavigne'}, {'song':'Makes Me Wonder','artist':'Maroon 5'}, {'song':'Buy U a Drank (Shawty Snappin\')','artist':'T-Pain featuring Yung Joc'}, {'song':'Umbrella','artist':'Rihanna featuring Jay-Z'}, {'song':'Hey There Delilah','artist':'Plain White T\'s'}, {'song':'Beautiful Girls','artist':'Sean Kingston'}, {'song':'Big Girls Don\'t Cry','artist':'Fergie'}, {'song':'Crank That (Soulja Boy)','artist':'Soulja Boy Tell \'Em'}, {'song':'Stronger','artist':'Kanye West'}, {'song':'Kiss Kiss','artist':'Chris Brown featuring T-Pain'}, {'song':'No One','artist':'Alicia Keys'} ];
        break;

      case 'custom-bilboard-2008':
        theData = [ {'song':'Low','artist':'Flo Rida featuring T-Pain'}, {'song':'Love in This Club','artist':'Usher featuring Young Jeezy'}, {'song':'Touch My Body','artist':'Mariah Carey'}, {'song':'Lollipop','artist':'Lil Wayne featuring Static Major'}, {'song':'Bleeding Love','artist':'Leona Lewis'}, {'song':'Take a Bow','artist':'Rihanna'}, {'song':'Viva la Vida','artist':'Coldplay'}, {'song':'I Kissed a Girl','artist':'Katy Perry'}, {'song':'Disturbia','artist':'Rihanna'}, {'song':'So What','artist':'Pink'}, {'song':'Womanizer','artist':'Britney Spears'}, {'song':'Whatever You Like','artist':'T.I.'}, {'song':'Live Your Life','artist':'T.I. featuring Rihanna'}, {'song':'Single Ladies (Put a Ring on It)','artist':'Beyoncé'} ];
        break;

      case 'custom-bilboard-2009':
        theData = [ {'song':'Single Ladies (Put a Ring on It)','artist':'Beyoncé'}, {'song':'Just Dance','artist':'Lady Gaga'}, {'song':'My Life Would Suck Without You','artist':'Kelly Clarkson'}, {'song':'Crack a Bottle','artist':'Eminem, Dr. Dre and 50 Cent'}, {'song':'Right Round','artist':'Flo Rida'}, {'song':'Poker Face','artist':'Lady Gaga'}, {'song':'Boom Boom Pow','artist':'The Black Eyed Peas'}, {'song':'I Gotta Feeling','artist':'The Black Eyed Peas'}, {'song':'Down','artist':'Jay Sean featuring Lil Wayne'}, {'song':'3','artist':'Britney Spears'}, {'song':'Down','artist':'Jay Sean featuring Lil Wayne'}, {'song':'Fireflies','artist':'Owl City'}, {'song':'Whatcha Say','artist':'Jason DeRulo'}, {'song':'Empire State of Mind','artist':'Jay-Z and Alicia Keys'} ];
        break;

      case 'custom-bilboard-2010':
        theData = [ {'song':'Tik Tok','artist':'Kesha'}, {'song':'Imma Be','artist':'The Black Eyed Peas'}, {'song':'Break Your Heart','artist':'Taio Cruz featuring Ludacris'}, {'song':'Rude Boy','artist':'Rihanna'}, {'song':'Nothin\' on You','artist':'B.o.B featuring Bruno Mars'}, {'song':'Not Afraid','artist':'Eminem'}, {'song':'OMG','artist':'Usher featuring will.i.am'}, {'song':'California Gurls','artist':'Katy Perry featuring Snoop Dogg'}, {'song':'Love the Way You Lie','artist':'Eminem featuring Rihanna'}, {'song':'Teenage Dream','artist':'Katy Perry'}, {'song':'Just the Way You Are','artist':'Bruno Mars'}, {'song':'Like a G6','artist':'Far East Movement featuring The Cataracs and Dev'}, {'song':'We R Who We R','artist':'Kesha'}, {'song':'What\'s My Name?','artist':'Rihanna featuring Drake'}, {'song':'Only Girl (In the World)','artist':'Rihanna'}, {'song':'Raise Your Glass','artist':'Pink'}, {'song':'Firework','artist':'Katy Perry'} ];
        break;

      case 'custom-bilboard-2011':
        theData = [ {'song':'Firework','artist':'Katy Perry'}, {'song':'Grenade','artist':'Bruno Mars'}, {'song':'Hold It Against Me','artist':'Britney Spears'}, {'song':'Black and Yellow','artist':'Wiz Khalifa'}, {'song':'Born This Way','artist':'Lady Gaga'}, {'song':'E.T.','artist':'Katy Perry featuring Kanye West'}, {'song':'S&M','artist':'Rihanna featuring Britney Spears'}, {'song':'Rolling in the Deep','artist':'Adele'}, {'song':'Give Me Everything','artist':'Pitbull featuring Ne-Yo, Afrojack and Nayer'}, {'song':'Party Rock Anthem','artist':'LMFAO featuring Lauren Bennett and GoonRock'}, {'song':'Last Friday Night (T.G.I.F.)','artist':'Katy Perry'}, {'song':'Moves Like Jagger','artist':'Maroon 5 featuring Christina Aguilera'}, {'song':'Someone Like You','artist':'Adele'}, {'song':'We Found Love','artist':'Rihanna featuring Calvin Harris'} ];
        break;

      case 'custom-bilboard-2012':
        theData = [  {'song':'Sexy and I Know It','artist':'LMFAO'}, {'song':'We Found Love','artist':'Rihanna featuring Calvin Harris'}, {'song':'Set Fire to the Rain','artist':'Adele'}, {'song':'Part of Me','artist':'Katy Perry'}, {'song':'Stronger (What Doesn\'t Kill You)','artist':'Kelly Clarkson'}, {'song':'We Are Young','artist':'Fun featuring Janelle Monáe'}, {'song':'Somebody That I Used to Know','artist':'Gotye featuring Kimbra'}, {'song':'Call Me Maybe','artist':'Carly Rae Jepsen'}, {'song':'Whistle','artist':'Flo Rida'}, {'song':'We Are Never Ever Getting Back Together','artist':'Taylor Swift'}, {'song':'One More Night','artist':'Maroon 5'}, {'song':'Diamonds','artist':'Rihanna'}, {'song':'Locked Out of Heaven','artist':'Bruno Mars'} ];
        break;

      case 'custom-bilboard-2013':
        theData = [ {'song':'Locked Out of Heaven','artist':'Bruno Mars'}, {'song':'Thrift Shop','artist':'Macklemore & Ryan Lewis featuring Wanz'}, {'song':'Harlem Shake','artist':'Baauer'}, {'song':'When I Was Your Man','artist':'Bruno Mars'}, {'song':'Just Give Me a Reason','artist':'Pink featuring Nate Ruess'}, {'song':'Can\'t Hold Us','artist':'Macklemore & Ryan Lewis featuring Ray Dalton'}, {'song':'Blurred Lines','artist':'Robin Thicke featuring T.I. and Pharrell'}, {'song':'Roar','artist':'Katy Perry'}, {'song':'Wrecking Ball','artist':'Miley Cyrus'}, {'song':'Royals','artist':'Lorde'}, {'song':'The Monster','artist':'Eminem featuring Rihanna'} ];
        break;

      case 'custom-bilboard-2014':
        theData = [ {'song':'The Monster','artist':'Eminem featuring Rihanna'}, {'song':'Timber','artist':'Pitbull featuring Kesha'}, {'song':'Dark Horse','artist':'Katy Perry featuring Juicy J'}, {'song':'Happy','artist':'Pharrell Williams'}, {'song':'All of Me','artist':'John Legend'}, {'song':'Fancy','artist':'Iggy Azalea featuring Charli XCX'}, {'song':'Rude','artist':'Magic!'}, {'song':'All About That Bass','artist':'Meghan Trainor'}, {'song':'Shake It Off','artist':'Taylor Swift'}, {'song':'Blank Space','artist':'Taylor Swift'} ];
        break;

      case 'custom-bilboard-2015':
        theData = [ {'song':'Blank Space','artist':'Taylor Swift'}, {'song':'Uptown Funk','artist':'Mark Ronson featuring Bruno Mars'}, {'song':'See You Again','artist':'Wiz Khalifa featuring Charlie Puth'}, {'song':'Bad Blood','artist':'Taylor Swift featuring Kendrick Lamar'}, {'song':'Cheerleader','artist':'OMI'}, {'song':'Can\'t Feel My Face','artist':'The Weeknd'}, {'song':'What Do You Mean?','artist':'Justin Bieber'}, {'song':'The Hills','artist':'The Weeknd'} ];
        break;

      case 'custom-bilboard-2016':
        theData = [ {'song':'Hello','artist':'Adele'}, {'song':'Sorry','artist':'Justin Bieber'}, {'song':'Love Yourself','artist':'Justin Bieber'}, {'song':'Pillowtalk','artist':'Zayn'}, {'song':'Work','artist':'Rhianna'}, {'song':'Panda','artist':'Desiigner'}];
        break;

      default:
        theData = [{'artist':'Prince','song':'When Doves Cry'},{'artist':'Madonna','song':'Borderline'},{'artist':'Chaka Khan','song':'I Feel for You'},{'artist':'Prince and the Revolution','song':'Let\'s Go Crazy'},{'artist':'Michael Jackson','song':'Thriller'},{'artist':'Cyndi Lauper','song':'Time After Time'},{'artist':'Don Henley','song':'The Boys of Summer'},{'artist':'Prince and the Revolution','song':'Purple Rain'},{'artist':'Bruce Springsteen','song':'Born in the U.S.A'},{'artist':'Sheila E.','song':'The Glamorous Life'},{'artist':'Tina Turner','song':'What\'s Love Got to Do With It?'},{'artist':'U2','song':'Pride (in the Name of Love)'},{'artist':'Newcleus','song':'Jam on It'},{'artist':'John Waite','song':'Missing You'},{'artist':'Nena','song':'99 Luftballons'},{'artist':'Tracey Ullman','song':'They Don\'t Know'},{'artist':'Sade','song':'Smooth Operator'},{'artist':'a-ha','song':'Take on Me'},{'artist':'Ashford %26 Simpson','song':'Solid'},{'artist':'Van Halen','song':'Panama'}];
        break; //1984
    }
    for (var i in theData) {
      artist = theData[i].artist;
      song = theData[i].song;
      customChart.push({ artist:artist, song:song });
      iTunesTerm = Boom.createItunesSearchTerm(artist +' '+ song);
    }
    Boom.displayChart(customChart);
  },

  getSpotifyChart: function(url) {
    $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    timeout: 5000,
    success: function(data) {
      if (data) {
        var spotifyChart = [], iTunesTerm = '', artist, song, track_url, item = data.tracks;
        $(item).each(function(i, value) {
          track_url = value.track_url;
          artist = value.artist_name;
          song = value.track_name;
          iTunesTerm = Boom.createItunesSearchTerm(artist +' '+ song);
          spotifyChart.push({ artist:artist, song:song });
        });
        Boom.displayChart(spotifyChart);
      }  else {
        return spotifyChart = [];
      }
    },
    error: Boom.displayError
    });
  },


  displayChart: function(theChart) {
    var iTunesTerm = '', listItemCollection = [], arrayLength = theChart.length, artist, song;
    for (var i = 0; i < arrayLength; i++) {
      iTunesTerm = Boom.createItunesSearchTerm(theChart[i].artist +' '+ theChart[i].song);
      $.getJSON('https://itunes.apple.com/search?limit=1&entity=song&term='+iTunesTerm, function(data) {
        $.each(data, function() {

          $.each(this, function(s, song) {

            var li = document.createElement('li'),
              a = document.createElement('a'),
              img = document.createElement('img'),
              h3 = document.createElement('h3'),
              h4 = document.createElement('h4'),
              audio = document.createElement('audio'),
              artistName = song.artistName || '',
              artworkUrl60 = song.artworkUrl60 || '',
              trackCensoredName = song.trackCensoredName || '',
              trackId = song.trackId || '',
              previewUrl = song.previewUrl || '#',
              trackViewUrl = song.trackViewUrl || '',
              h3Text, h4Text;

            a.href = '#';
            a.setAttribute('id', trackId);
            a.setAttribute('title', 'Preview ' + artistName + ' – "' + trackCensoredName + '" in iTunes');

            audio.setAttribute('type', 'audio/mpeg');
            audio.setAttribute('src', previewUrl);
            audio.setAttribute('preload', 'auto');
            audio.setAttribute('controls', '');
            if(previewUrl == '#') {
              audio.setAttribute('class', 'noaudio');
              audio.setAttribute('title', 'No audio available');
            }

            img.src = artworkUrl60;
            img.setAttribute('height', '60');
            img.setAttribute('width', '60');
            img.setAttribute('alt', 'album art');
            img.setAttribute('class', 'album');

            h3Text = document.createTextNode(artistName);
            h3.appendChild(h3Text);
            h4Text = document.createTextNode(trackCensoredName);
            h4.appendChild(h4Text);
            trackViewUrl = Boom.getLocalizedLink(trackViewUrl);

            a.appendChild(img);
            a.appendChild(h3);
            a.appendChild(h4);
            li.appendChild(a);
            li.appendChild(audio);
            listItemCollection[i++] = li;
            a.onclick = function() {
              chrome.tabs.update(null, {url: trackViewUrl});
              return(false);
            }.bind(this, trackViewUrl);
            $('section ol').append(li);
          });
        });
      });
    }
  },

  getLocalizedLink: function(url) {
    var userLocale = chrome.i18n.getMessage('@@ui_locale');
    var iTunesCountry = 'us';
    switch(userLocale) {
      case 'ar': iTunesCountry = 'sa'; break;
      case 'am': iTunesCountry = 'bf'; break;
      case 'bg': iTunesCountry = 'bg'; break;
      case 'bn': iTunesCountry = 'in'; break;
      case 'ca': iTunesCountry = 'es'; break;
      case 'cs': iTunesCountry = 'cz'; break;
      case 'da': iTunesCountry = 'dk'; break;
      case 'de': iTunesCountry = 'de'; break;
      case 'el': iTunesCountry = 'gr'; break;
      case 'en': iTunesCountry = 'us'; break;
      case 'en_GB': iTunesCountry = 'gb'; break;
      case 'en_US': iTunesCountry = 'us'; break;
      case 'es': iTunesCountry = 'es'; break;
      case 'es_419': iTunesCountry = 'mx'; break;
      case 'et': iTunesCountry = 'ee'; break;
      case 'fa': iTunesCountry = 'us'; break;
      case 'fi': iTunesCountry = 'fi'; break;
      case 'fil': iTunesCountry = 'ph'; break;
      case 'fr': iTunesCountry = 'fr'; break;
      case 'he': iTunesCountry = 'il'; break;
      case 'hi': iTunesCountry = 'in'; break;
      case 'hr': iTunesCountry = 'hr'; break;
      case 'hu': iTunesCountry = 'hu'; break;
      case 'id': iTunesCountry = 'id'; break;
      case 'it': iTunesCountry = 'it'; break;
      case 'ja': iTunesCountry = 'jp'; break;
      case 'kn': iTunesCountry = 'in'; break;
      case 'ko': iTunesCountry = 'kr'; break;
      case 'lt': iTunesCountry = 'lt'; break;
      case 'lv': iTunesCountry = 'lv'; break;
      case 'ml': iTunesCountry = 'in'; break;
      case 'mr': iTunesCountry = 'in'; break;
      case 'ms': iTunesCountry = 'my'; break;
      case 'nl': iTunesCountry = 'nl'; break;
      case 'no': iTunesCountry = 'no'; break;
      case 'pl': iTunesCountry = 'pl'; break;
      case 'pt_BR': iTunesCountry = 'br'; break;
      case 'pt_PT': iTunesCountry = 'pt'; break;
      case 'ro': iTunesCountry = 'ro'; break;
      case 'ru': iTunesCountry = 'ru'; break;
      case 'sk': iTunesCountry = 'sk'; break;
      case 'sl': iTunesCountry = 'si'; break;
      case 'sr': iTunesCountry = 'si'; break;
      case 'sv': iTunesCountry = 'se'; break;
      case 'sw': iTunesCountry = 'tz'; break;
      case 'ta': iTunesCountry = 'in'; break;
      case 'te': iTunesCountry = 'in'; break;
      case 'th': iTunesCountry = 'th'; break;
      case 'tr': iTunesCountry = 'tr'; break;
      case 'uk': iTunesCountry = 'ua'; break;
      case 'vi': iTunesCountry = 'vn'; break;
      case 'zh_CN': iTunesCountry = 'cn'; break;
      case 'zh_TW': iTunesCountry = 'tw'; break;
      default: iTunesCountry = 'us'; break;
    }
    if (url !== '' && url !== undefined && url !== 'undefined') {
      url = url.replace(url.split('/')[3], iTunesCountry) + '&app=itunes&at=11l9uH';
    }
    return url;
  },

  createItunesSearchTerm: function(searchterm) {
    searchterm = searchterm.replace(/ /g, '+');
    return searchterm;
  },

  displayError: function() {
    // hide gracefully
  },

  update: function() {
    requestAnimationFrame(Boom.update);
    analyser.getByteFrequencyData(frequencyData);
    var fullBG = 0;
    bars.each(function (index, bar) {
      var barHeightPerc = frequencyData[index]/256,
      r = Math.floor(barHeightPerc*255),
      g = 0,
      b = 255 - Math.floor(barHeightPerc*255);
      bar.style.height = barHeightPerc*25 + 'px';
      bar.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    });
  },

  setCurrentAudio: function(currentAudio) {
    sourceNode = context.createMediaElementSource(currentAudio);
    sourceNode.connect(analyser);
    analyser.connect(context.destination);
    analyser.getByteFrequencyData(frequencyData);
    for (var i=0; i < analyser.frequencyBinCount; i++) {
      $("<div/>").css("left", i * barSpacingPercent + "%").appendTo(visualisation);
    }
    Boom.update();
  }
};

$(function() {
  Boom.init();
  document.addEventListener('play', function(e) {
    audios = document.getElementsByTagName('audio');
    for (var i=0, len=audios.length; i < len; i++) {
      if(audios[i] != e.target){
        audios[i].pause();
      } else {
        currentAudio = audios[i];
        Boom.setCurrentAudio(currentAudio);
      }
    }
  },true);
  document.getElementById('chartselector').addEventListener('change', function(e) {
    //console.log('change fired ' + e.target.tagName + e.target.value);
    localStorage['lastListenedTo'] = e.target.value;
    $('li').remove();
    if (this.value.indexOf('spotify') != -1) {
      Boom.getSpotifyChart(this.value);
    } else if (this.value.indexOf('audioscrobbler') != -1) {
      Boom.getXmlChart(this.value, 'track');
    } else if (this.value.indexOf('apple') != -1) {
      Boom.getXmlChart(this.value, 'entry');
    } else if (this.value.indexOf('http') == -1) {
      Boom.getInternalChart(this.value);
    } else {
      Boom.getXmlChart(this.value, 'item');
    }
  }, false);
});