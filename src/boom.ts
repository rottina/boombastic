// var context = new AudioContext(),
//     analyser = this.context.createAnalyser(),
//     frequencyData = new Uint8Array(this.analyser.frequencyBinCount),
//     sourceNode, audios, currentAudio,
//     visualisation = document.getElementById("visualisation"),
//     // $("#visualisation"),
//     bars = document.getElementById("visualisation > div"),
//     barSpacingPercent = 100 / this.analyser.frequencyBinCount;

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
        for (const [i, node] of nodeList.entries()) {
          console.group(i, node);
          console.log(
            `%c${i}`,
            "color:red",
            node.querySelector("title")?.textContent || "",
          );
          console.log(i, node.querySelector("rights")?.textContent || "No rights");
          console.log(i, node.querySelector("artist")?.textContent || "No artist");
          console.groupEnd();
        }
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
};

window.addEventListener("load", (event) => {
  console.log("extension loaded");
  Boom.init();
});
