const Boom = {
  init: () => {
    console.log("in INIT");
    Boom.getTracks(
      "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=6/explicit=true/xml",
      "xml",
    );
  },

  getTracks: async function getData(playlist: string, dataType: string) {
    const playlistInfo: string = "in gettracks " + playlist;
    console.log(playlist);
    const response = await fetch(playlist);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const tracks = await response.text();
    if (tracks) {
      if (dataType === "xml") {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(tracks, "text/xml");
        //console.log(Object.values(xmlDoc));
        const nodeList = xmlDoc.querySelectorAll("entry");
        let trackArtist, trackTitle, trackAlbum, trackUrl; 
        for (const [i, node] of nodeList.entries()) {
          trackArtist = node.querySelector("artist")?.textContent || "No artist";
          trackTitle = node.querySelector("name")?.textContent || "No title";

          // trackUrl = node.querySelector("im:collection")?.textContent || "No url";
          // Fields needed:
          // artist, title, 60img, album/song url
          console.group(i, node);
          console.log(
            `%c${i}`,
            "color:green",
            node.querySelector("name")?.textContent || "No song title",
          );
          console.log(i, node.querySelector("artist")?.textContent || "No artist");
          console.log(i, node.querySelector('image[height="60"]')?.textContent?.trim() ?? "No 60 img");
          
          console.log(i, node.querySelector('link[rel="enclosure"]')?.getAttribute('href') || "No mp4 link");
          console.log(i, node.querySelector("price")?.textContent || "No price");
          console.groupEnd();
        }
        //Boom.displayTrack(trackArtist, trackTitle);
        // console.log(xmlDoc.getElementsByTagName('entry')[0]);
        // console.log(xmlDoc.getElementsByTagName('im:name')[0]);
        // console.log(xmlDoc.getElementsByTagName('title')[0]);
      } else {
        //json  [0].childNodes[5]
      }
    } else {
      console.error("Failed to parse response");
    }
  },

  displayTrack: function displayTrack(trackArtist: string, trackTitle: string) {
    console.log("in printTracks");
    console.log(trackArtist +' *** '+ trackTitle);
    let li = document.createElement("li");
    let Text = document.createTextNode(trackArtist);
    li.appendChild(Text);
    document.querySelector("ul")?.appendChild(li);
  }
};

window.addEventListener("load", (event) => {
  console.log("extension loaded");
  Boom.init();
});
