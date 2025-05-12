const Boom = {
  init: () => {
    const publisherId = "11l6841";
    console.log("in Init");
    Boom.getTracks(
      "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=6/explicit=true/json"
    );
  },

  getTracks: async <T>(playlist: string): Promise<T> => {
    const playlistInfo: string = "in gettracks " + playlist;
    console.log(playlist);
    try {
      const response = await fetch(playlist);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {

        const data = await response.json();
        const tracks = data.feed.entry;
        console.dir(tracks);
        for (let i = 0; i < tracks.length; i++) {
          let trackId = tracks[i].id.attributes["im:id"];
          let trackArtist = tracks[i]["im:artist"].label;
          let trackTitle = tracks[i]["im:name"].label;
          let trackImgUrl = tracks[i]["im:image"][2].label;
          let trackAudioUrl = tracks[i].link[1].attributes.href;

          console.group(i);
          console.log("trackId: " + trackId);
          console.log(
            `%c${i}`,
            "color:green",
            trackArtist
          );
          console.log(
            `%c${i}`,
            "font-style:bold",
            trackTitle
          );
          console.log("trackImgUrl: " + trackImgUrl);
          console.log("trackAudioUrl: " + trackAudioUrl);
          console.groupEnd();
          
          Boom.displayTrack(trackId, trackArtist, trackTitle, trackImgUrl, trackAudioUrl);
        }
        return data as T; // Return the data as the generic type T
      }
    }
    catch (error: any) {
      console.error("Fetch error:", error);
      throw error;
    }
  },

  displayTrack: function displayTrack(trackId: string, trackArtist: string, trackTitle: string, trackImgUrl: string, trackAudioUrl: string) {
    console.log("in displayTrack");
    let li = document.createElement("li");
    let Text = document.createTextNode(trackArtist);
    li.appendChild(Text);
    document.querySelector("ul")?.appendChild(li);
    Boom.generateAudioElement(trackArtist, trackAudioUrl, trackTitle, trackImgUrl);
  },

  generateAudioElement: function displayTrack(trackArtist: string, trackTitle: string,  trackImgUrl: string, trackAudioUrl: string) {
    console.log("in generateAudioElement");
    let audio = document.createElement("audio");
    audio.setAttribute("type", "audio/mpeg");
    audio.setAttribute("src", trackAudioUrl);
    audio.setAttribute("controls", "controls");
    audio.setAttribute("controlsList", "nodownload");
    audio.setAttribute("preload", "auto");
    audio.setAttribute("loop", "false");

    let link = document.createElement("a");
    link.setAttribute("href", trackAudioUrl);
    link.setAttribute("id", "x");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("title", "blahhhhh");

    let itms = document.createElement("img");
    itms.setAttribute("src", "../img/iTunes_Store_Small_Badge_RGB_012318.svg");
    itms.setAttribute("alt", "iTunes Store");
    itms.setAttribute("class", "itms");
    itms.setAttribute("title", "Get it on iTunes");

    let img = document.createElement("img");
    img.setAttribute("src", trackAudioUrl);
    img.setAttribute("height", "60");
    img.setAttribute("width", "60");
    img.setAttribute("alt", "album art");
    img.setAttribute("class", "album");
    img.setAttribute("title", "album art");
    //img.setAttribute("loading", "lazy");

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "artist");
    h3.innerText = "Taylor Swift";
    
    let h4 = document.createElement("h4");
    h4.setAttribute("class", "title");
    h4.innerText = "Anti-Hero";
    
    document.querySelector("ul")?.appendChild(audio);
    document.querySelector("ul")?.appendChild(link);
    document.querySelector("ul")?.appendChild(itms);
    document.querySelector("ul")?.appendChild(img);
    document.querySelector("ul")?.appendChild(h3);
    document.querySelector("ul")?.appendChild(h4);   
  } // Closing brace for generateAudioElement function

}; // Closing brace for Boom object

window.addEventListener("load", (event) => {
  console.log("extension loaded");
  Boom.init();
});
