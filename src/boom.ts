
const Boom = {
  init: () => {
    Boom.populateSelector();
    Boom.getTracks(
      "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=18/explicit=true/json"
    );
  },

  getTracks: async <T>(playlist: string): Promise<T> => {
    const playlistInfo: string = "in gettracks " + playlist;
    //console.log(playlist);
    try {
      const response = await fetch(playlist);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const publisherSlug = "&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1667990774&at=11l6841";
      let parent = document.querySelector("ol");
      if (parent) { parent.innerHTML = ""; } //clear children
      const data = await response.json();
      const tracks = data.feed.entry;
      console.dir(tracks);
      for(const track of tracks) {
        let trackId = track.id.attributes["im:id"];
        let trackArtist = track["im:artist"].label;
        let trackTitle = track["im:name"].label; 
        let trackImgUrl = track["im:image"][1].label;
        let trackAudioUrl = track.link[1].attributes.href;
        let trackAppleMusicUrl = track.id.label + publisherSlug;
        let trackAlbumName = track["im:collection"]["im:name"].label;

          // console.group(trackId);
          console.log("trackAlbumName: " + trackAlbumName);
          // console.log(
          //   `%c${trackId}`,
          //   "color:green",
          //   trackArtist,
          //   trackTitle
          // );
          // console.log("trackImgUrl: " + trackImgUrl);
          // //console.log("trackAudioUrl: " + trackAudioUrl);
          // console.log("trackAppleMusicUrl: " + trackAppleMusicUrl);
          // console.groupEnd();
          
        Boom.displayTrack(trackId, trackArtist, trackTitle, trackImgUrl, trackAudioUrl, trackAppleMusicUrl, trackAlbumName);
        //break; // debug: Remove this break to display all tracks
      }
      return data as T; // Return the data as the generic type T
    }
    catch (error: any) {
      console.error("Fetch error:", error);
      throw error;
    }
  },

  displayTrack: function displayTrack(trackId: string, trackArtist: string, trackTitle: string, trackImgUrl: string, trackAudioUrl: string, trackAppleMusicUrl: string, trackAlbumName: string) {
    //console.log("in displayTrack");
    let li = document.createElement("li");
    li.setAttribute("data-id", trackId);
    // console.log("trackImgUrl: " + trackImgUrl);
    // console.log("trackAudioUrl: " + trackAudioUrl);
    // console.log("trackAppleMusicUrl: " + trackAppleMusicUrl);
    let Text = document.createTextNode(trackArtist);
    document.querySelector("ol")?.appendChild(li);
    Boom.generateAudioElement({li, trackArtist, trackAudioUrl, trackTitle, trackImgUrl, trackAppleMusicUrl, trackAlbumName});
  },

  generateAudioElement: function displayTrack({li, trackArtist, trackTitle, trackImgUrl, trackAudioUrl, trackAppleMusicUrl, trackAlbumName}:{li: HTMLLIElement, trackArtist: string, trackTitle: string,  trackImgUrl: string, trackAudioUrl: string, trackAppleMusicUrl: string, trackAlbumName: string}) {
    //console.log("in generateAudioElement -------" + trackAudioUrl);
    let audio = document.createElement("audio");
    audio.setAttribute("type", "audio/mpeg");
    audio.setAttribute("src", "" + trackAudioUrl);
    audio.setAttribute("controls", "");
    audio.setAttribute("preload", "auto");
    audio.setAttribute("loop", "false");

    let link = document.createElement("a");
    link.setAttribute("href", trackAppleMusicUrl);
    link.setAttribute("id", "x");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("title", trackTitle);

    let amImage = document.createElement("img");
    amImage.setAttribute("src", "../img/apple-music-compact.svg");
    amImage.setAttribute("alt", "Apple Music");
    amImage.setAttribute("class", "am");
    amImage.setAttribute("title", "Lsten on Apple Music");

    let img = document.createElement("img");
    img.setAttribute("src", trackImgUrl);
    img.setAttribute("class", "album");
    img.setAttribute("height", "60");
    img.setAttribute("width", "60");
    img.setAttribute("alt", "album cover");
    img.setAttribute("title", trackAlbumName);

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "artist");
    let h3Node: Text = document.createTextNode(trackArtist);
    if (h3) { h3.appendChild(h3Node); }
    
    let h4 = document.createElement("h4");
    h4.setAttribute("class", "title");
    let h4Node: Text = document.createTextNode(trackTitle);
    if (h4) { h4.appendChild(h4Node); }

    link.appendChild(img);
    link.appendChild(h3);
    link.appendChild(h4);
    li.appendChild(link);
    li.appendChild(audio);
    li.appendChild(amImage);
    document.querySelector("ol")?.appendChild(li);
  },

  populateSelector: async <T>(): Promise<T> => {
    console.log('in populateSelect');
    const optionsFile = "options.json";
    try {
      const response = await fetch(optionsFile);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      const data = await response.json();
      const prefix = "https://itunes.apple.com/us/rss/topsongs/limit=25/";
      const opts = data.options;
      console.dir(opts);
      const selector = document.querySelector("select");
        console.dir(opts);
        for(const opt of opts) {
          //break; // debug
          if (selector) {
              let optionElement = document.createElement("option");
              if (optionElement) {
                optionElement.value = prefix + opt.value;
                optionElement.textContent = opt.label;
              }
              if (optionElement) {
                selector.appendChild(optionElement);
              }
              selector.addEventListener("change", (event) => {
              let selectedValue = (event.target as HTMLSelectElement).value;
              console.log("Selected value:", selectedValue);
              // Call getTracks with the selected value
              Boom.getTracks(selectedValue);
            });
          }
        }
        return data as T; // Return the data as the generic type T
    }
    catch (error: any) {
      console.error("Fetch error:", error);
      throw error;
    }

  } // Closing brace for generateAudioElement function
}; // Closing brace for Boom object

document.addEventListener("play", (e) => {
    let audios = document.getElementsByTagName('audio');
    for(let ag = 0, len = audios.length; ag < len; ag++){
      if(audios[ag] != e.target){
        audios[ag].pause();
      }
    }
}, true);

window.addEventListener("load", (event) => {
  console.log("extension loaded");
  Boom.init();
});
