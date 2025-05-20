const publisherSlug = "&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1667990774&at=11l6841";
const Boom = {
  init: () => {
    let lastListenedTo = localStorage["lastListenedTo"] || "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=18/explicit=true/json";
    if (lastListenedTo) {
      console.log("lastListenedTo: " + lastListenedTo);
      localStorage["lastListenedTo"] = lastListenedTo;
    } else {
      console.log("lastListenedTo is null");
    }
    Boom.populateSelector();
    Boom.getTracks(lastListenedTo);
  },

  getTracks: async <T>(playlist: string): Promise<T | undefined> => {
    //console.log(playlist);
    if (playlist.includes("pitchfork")) {
      console.log("pitchfork playlist");
      fetch(playlist)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
          const items = data.querySelectorAll("item");
          items.forEach(item => {
            const titleElement = item.querySelector("title");
            const title = titleElement ? titleElement.textContent : null;
            const creatorElement = item.querySelector("creator");
            const creator = creatorElement ? creatorElement.textContent : null;
            console.log("Title:", title);
            console.log("Creator:", creator);
            let appleMusicTerm = Boom.createItunesSearchTerm(creator + " " + title);
          });
        }).catch(error => console.error('Error fetching or parsing RSS:', error));

    } else if (playlist.includes("custom-bilboard")) {
        try {
        const response = await fetch("playlists/"+playlist+".json");
        console.log("bilboard playlist " + playlist + ".json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let parent = document.querySelector("ul");
        if (parent) { parent.innerHTML = ""; } //clear children
        const data = await response.json();
        const tracks = data.feed.entry;
        //console.dir(tracks);
        for (const track of tracks) {
          let trackId = track.id.attributes["im:id"];
          let trackArtist = track["im:artist"].label;
          let trackTitle = track["im:name"].label; 
          let trackImgUrl = track["im:image"][1].label;
          let trackAudioUrl = track.link[1].attributes.href;
          let trackAppleMusicUrl = track.id.label + publisherSlug;
          let trackAlbumName = track["im:collection"]["im:name"].label;
          Boom.displayTrack(trackId, trackArtist, trackTitle, trackImgUrl, trackAudioUrl, trackAppleMusicUrl, trackAlbumName);
          //break; // debug: Remove this break to display all tracks
        }
        return data as T; // Return the data as the generic type T
      }
      catch (error: any) {
        console.error("Fetch error:", error);
        throw error;
        return undefined; // Ensure a return value in case of an error
      }
      
    } else {

      try {
        const response = await fetch(playlist);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let parent = document.querySelector("ul");
        if (parent) { parent.innerHTML = ""; } //clear children
        const data = await response.json();
        const tracks = data.feed.entry;
        //console.dir(tracks);
        for (const track of tracks) {
          let trackId = track.id.attributes["im:id"];
          let trackArtist = track["im:artist"].label;
          let trackTitle = track["im:name"].label; 
          let trackImgUrl = track["im:image"][1].label;
          let trackAudioUrl = track.link[1].attributes.href;
          let trackAppleMusicUrl = track.id.label + publisherSlug;
          let trackAlbumName = track["im:collection"]["im:name"].label;
          Boom.displayTrack(trackId, trackArtist, trackTitle, trackImgUrl, trackAudioUrl, trackAppleMusicUrl, trackAlbumName);
          //break; // debug: Remove this break to display all tracks
        }
        return data as T; // Return the data as the generic type T
      }
      catch (error: any) {
        console.error("Fetch error:", error);
        throw error;
        return undefined; // Ensure a return value in case of an error
      }
    }
  },

  createItunesSearchTerm: function createItunesSearchTerm(searchTerm: string) {
    let searchUrl = "https://itunes.apple.com/search?limit=15&media=music&entity=song&country=us&term=";

    let searchString = searchTerm.replace(/ /g, "+");
    searchUrl += searchString;
    console.log("createItunesSearchTermcreateItunesSearchTerm: " + searchUrl);
    //WIP
    // createItunesSearchTermcreateItunesSearchTerm: https://itunes.apple.com/search?term=Eric+Torres+Echoes,+Spaces,+Lines

    // fetch(searchUrl)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log("data: " + data);
    //     console.dir(data);
    //   })
    //   .catch(error => console.error('Error fetching or parsing RSS:', error));
  },

  displayTrack: function displayTrack(trackId: string, trackArtist: string, trackTitle: string, trackImgUrl: string, trackAudioUrl: string, trackAppleMusicUrl: string, trackAlbumName: string) {
    //console.log("in displayTrack");
    let li = document.createElement("li");
    li.setAttribute("data-id", trackId);
    document.querySelector("ul")?.appendChild(li);
    Boom.generateTrackPanel({li, trackArtist, trackAudioUrl, trackTitle, trackImgUrl, trackAppleMusicUrl, trackAlbumName});
  },

  generateTrackPanel: function generateTrackPanel({li, trackArtist, trackTitle, trackImgUrl, trackAudioUrl, trackAppleMusicUrl, trackAlbumName}:{li: HTMLLIElement, trackArtist: string, trackTitle: string,  trackImgUrl: string, trackAudioUrl: string, trackAppleMusicUrl: string, trackAlbumName: string}) {
    let audio = document.createElement("audio");
    audio.setAttribute("type", "audio/mpeg");
    audio.setAttribute("src", "" + trackAudioUrl);
    audio.setAttribute("controls", "");
    audio.setAttribute("preload", "auto");
    audio.setAttribute("loop", "false");

    let link = document.createElement("a");
    link.setAttribute("href", trackAppleMusicUrl);
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("target", "_blank");
    link.setAttribute("title", trackTitle);

    let amImage = document.createElement("img");
    amImage.setAttribute("alt", "Apple Music");
    amImage.setAttribute("class", "am");
    amImage.setAttribute("src", "../img/apple-music-compact.svg");
    amImage.setAttribute("title", "Lsten on Apple Music");

    let img = document.createElement("img");
    img.setAttribute("alt", "album cover");
    img.setAttribute("class", "album");
    img.setAttribute("src", trackImgUrl);
    img.setAttribute("title", trackAlbumName);
    img.setAttribute("height", "60");
    img.setAttribute("width", "60");

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
    document.querySelector("ul")?.appendChild(li);
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
      const appleMusicPrefix = "https://itunes.apple.com/us/rss/topsongs/limit=25/";
      const opts = data.options;
      const selector = document.querySelector("select");
        //console.dir(opts);
        for(const opt of opts) {
          //break; // debug
          if (selector) {
              let optionElement = document.createElement("option");
              if (optionElement) {
                if (opt.type === "appmus") {
                  optionElement.value = appleMusicPrefix + opt.value;
                } else {
                  optionElement.value = opt.value;
                }
                optionElement.textContent = opt.label;
                if(opt.type === "na") {
                  optionElement.setAttribute("disabled", "disabled");
                }
                selector.setAttribute("selected", "selected");
                selector.appendChild(optionElement);
              }

              selector.addEventListener("change", (event) => {
              let selectedValue = (event.target as HTMLSelectElement).value;
              console.log("Selected value:", selectedValue);
              localStorage["lastListenedTo"] = selectedValue;
              console.log("changed lastListenedTo: " + selectedValue);
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

  } 
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
