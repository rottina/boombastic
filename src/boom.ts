import { isThrowStatement } from "typescript";

const Boom = {
  init: () => {
    const publisherId = "11l6841";
    // https://music.apple.com/us/album/last-night/1667990565?i=1667990774&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1667990774&at=11l6841

    //https://music.apple.com/us/album/catch-a-cold-one/1752596071?i=1752596086&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1752596086&at=11l6841
    console.log("in Init");
    Boom.getTracks(
      "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=18/explicit=true/json"
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
          let trackImgUrl = tracks[i]["im:image"][1].label;
          let trackAudioUrl = tracks[i].link[1].attributes.href;
          let trackAppleMusicUrl = tracks[i].id.label;

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
          console.log("trackAppleMusicUrl: " + trackAppleMusicUrl);
          console.groupEnd();
          
          Boom.displayTrack(trackId, trackArtist, trackTitle, trackImgUrl, trackAudioUrl, trackAppleMusicUrl);
          break; // debug: Remove this break to display all tracks
        }
        return data as T; // Return the data as the generic type T
      }
    }
    catch (error: any) {
      console.error("Fetch error:", error);
      throw error;
    }
  },

  displayTrack: function displayTrack(trackId: string, trackArtist: string, trackTitle: string, trackImgUrl: string, trackAudioUrl: string, trackAppleMusicUrl: string) {
    console.log("in displayTrack");
    let li = document.createElement("li");
    console.log("trackImgUrl: " + trackImgUrl);
    console.log("trackImgUrl: " + trackImgUrl);
    console.log("trackAppleMusicUrl: " + trackAppleMusicUrl);
    //let Text = document.createTextNode(trackArtist);
    document.querySelector("ul")?.appendChild(li);
    Boom.generateAudioElement(li, trackArtist, trackAudioUrl, trackTitle, trackImgUrl, trackAppleMusicUrl);
  },

  generateAudioElement: function displayTrack(li: HTMLLIElement, trackArtist: string, trackTitle: string,  trackImgUrl: string, trackAudioUrl: string, trackAppleMusicUrl: string) {
    console.log("in generateAudioElement");
    let audio = document.createElement("audio");
    audio.setAttribute("type", "audio/mpeg");
    audio.setAttribute("src", trackImgUrl);
    audio.setAttribute("controls", "controls");
    audio.setAttribute("controlsList", "nodownload");
    audio.setAttribute("preload", "auto");
    audio.setAttribute("loop", "false");

    let link = document.createElement("a");
    link.setAttribute("href", trackAppleMusicUrl);
    link.setAttribute("id", "x");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("title", "WOOOOOO");

    let amImage = document.createElement("img");
    amImage.setAttribute("src", "../img/apple-music-compact.svg");
    amImage.setAttribute("alt", "Apple Music");
    amImage.setAttribute("class", "am");
    amImage.setAttribute("title", "Lsten on Apple Music");

    let img = document.createElement("img");
    img.setAttribute("src", trackAudioUrl );
    img.setAttribute("class", "album");
    img.setAttribute("height", "60");
    img.setAttribute("width", "60");
    img.setAttribute("alt", "album art");
    img.setAttribute("title", "album art");
    //img.setAttribute("loading", "lazy");

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "artist");
    let h3Node: Text = document.createTextNode(trackArtist);
    if (h3) { h3.appendChild(h3Node); }
    
    let h4 = document.createElement("h4");
    h4.setAttribute("class", "title");
    let h4Node: Text = document.createTextNode('Static track name blah');
    if (h4) { h4.appendChild(h4Node); }

    link.appendChild(img);
    link.appendChild(h3);
    link.appendChild(h4);
    li.appendChild(link);
    li.appendChild(audio);
    li.appendChild(amImage);
    document.querySelector("ol")?.appendChild(li);

// <li>
//   <a href="#" id="1650841515" title="Taylor Swift in iTunes">
//     <img src="60x60bb.jpg" height="60" width="60" alt="album art" class="album">
//     <h3>Taylor Swift</h3>
//     <h4>Anti-Hero</h4>
//   </a>
//     <audio type="audio/mpeg" src="aac.p.m4a" preload="auto" controls=""></audio>
//     <img src="/img/iTunes_Store_Small_Badge_RGB_012318.svg" alt="iTunes Store" class="itms" title="Get it on iTunes">
// </li>


 
  } // Closing brace for generateAudioElement function

}; // Closing brace for Boom object

window.addEventListener("load", (event) => {
  console.log("extension loaded");
  Boom.init();
});
