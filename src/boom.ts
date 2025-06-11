const defaultPlaylist =
  "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=18/explicit=true/json";
const localStorageKey = "lastListenedTo";
const localStorageVal =
  localStorage.getItem("lastListenedTo") || defaultPlaylist;
const publisherSlug =
  "&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1667990774&at=11l6841";
const githubPrefix =
  "https://raw.githubusercontent.com/rottina/boombastic/refs/heads/main/src/playlists/";
const itunesApiPrefix =
  "https://itunes.apple.com/search?limit=1&media=music&entity=song&term=";
const appleMusicPrefix =
  "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=";
const appleMusicSuffix = "/explicit=true/json";
const context = new AudioContext();
const analyser = context.createAnalyser();
const audios = undefined;
const barSpacingPercent = 100 / analyser.frequencyBinCount;
const currentAudio = undefined;
const frequencyData = new Uint8Array(analyser.frequencyBinCount);
let sourceNode = undefined;
const visualisation = document.getElementById("viz");

class Boomer {
  // OK Boomer!
  constructor() {
    Playlist.prototype.getPlaylist(defaultPlaylist);
    console.log("Boomer initialized with default playlist:", defaultPlaylist);
  }
}

class Header extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
    <header>
        <h1>B<span class="o1">o</span><span class="o2">o</span>mbastic<span class="o2"> !</span></h1>
        <h2>Discover and preview popular tracks on the web.</h2>
        <div id="viz" class="hideIfNoApi">
          <div data-yo="mike" style="left: 0%; height: 0"></div><div data-yo="ag" style="left: 3.125%; height: 0"></div><div data-yo="chris" style="left: 6.25%; height: 0"></div><div style="left: 9.375%; height: 0"></div><div style="left: 12.5%; height: 0"></div><div style="left: 15.625%; height: 0"></div><div style="left: 18.75%; height: 0"></div><div style="left: 21.875%; height: 0"></div><div style="left: 25%; height: 0"></div><div style="left: 28.125%; height: 0"></div><div style="left: 31.25%; height: 0"></div><div style="left: 34.375%; height: 0"></div><div style="left: 37.5%; height: 0"></div><div style="left: 40.625%; height: 0"></div><div style="left: 43.75%; height: 0"></div><div style="left: 46.875%; height: 0"></div><div style="left: 50%; height: 0"></div><div style="left: 53.125%; height: 0"></div><div style="left: 56.25%; height: 0"></div><div style="left: 59.375%; height: 0"></div><div style="left: 62.5%; height: 0"></div><div style="left: 65.625%; height: 0"></div><div style="left: 68.75%; height: 0"></div><div style="left: 71.875%; height: 0"></div><div style="left: 75%; height: 0"></div><div style="left: 78.125%; height: 0"></div><div style="left: 81.25%; height: 0"></div><div style="left: 84.375%; height: 0"></div><div style="left: 87.5%; height: 0"></div><div style="left: 90.625%; height: 0"></div><div style="left: 93.75%; height: 0"></div><div style="left: 96.875%; height: 0"></div>
        </div>
        <select></select>
      </header>
    `;
    this.appendChild(template.content.cloneNode(true));
    this.populateSelector(appleMusicPrefix, appleMusicSuffix);
  }

  populateSelector(appleMusicPrefix: string, appleMusicSuffix: string) {
    const optionsFile = "options.json";
    fetch(optionsFile)
      .then((response) => response.json())
      .then((data) => {
        const opts = data.options;
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const selector = this.querySelector("select")!;
        for (const opt of opts) {
          const optionElement = document.createElement("option");
          optionElement.value = opt.value;
          optionElement.textContent = opt.label;
          if (opt.type === "na") {
            optionElement.setAttribute("disabled", "disabled");
          }
          if (opt.value === localStorageVal) {
            console.log(
              `localStorage.lastListenedTo: ${localStorage.lastListenedTo}`,
            );
            optionElement.setAttribute("selected", "selected");
          }
          selector.appendChild(optionElement);
        }
      })
      .then(() => {
        this.dispatchEvent(
          new CustomEvent("playlist-changed", {
            detail: { selectedValue: this.querySelector("select")?.value },
            bubbles: true,
            composed: true,
          }),
        );
      });
  }

  connectedCallback(): void {
    console.log("header component added to DOM");
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const selector = this.querySelector("select")!;
    selector.addEventListener("change", (event) => {
      const selectedValue = (event.target as HTMLSelectElement).value;
      console.log("Selected value:", selectedValue);
      this.dispatchEvent(
        new CustomEvent("playlist-changed", {
          detail: { selectedValue },
          bubbles: true,
          composed: true,
        }),
      );
      //Boom.getTracks(selectedValue);
    });
  }
}
customElements.define("header-component", Header);

class Playlist extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
      <ul></ul>
    `;
    this.appendChild(template.content.cloneNode(true));
  }

  static itunesSearch(finalSearchString: string) {
    const searchUrl = itunesApiPrefix + finalSearchString;
    fetch(searchUrl)
      .then((response) => response.json())
      .then((res) => {
        if (res.resultCount > 0) {
          const trackId = res.results[0].trackId;
          const trackArtist = res.results[0].artistName;
          const trackTitle = res.results[0].trackName;
          const trackImgUrl = res.results[0].artworkUrl100;
          const trackAudioUrl = res.results[0].previewUrl;
          const trackAppleMusicUrl =
            res.results[0].collectionViewUrl + publisherSlug;
          const trackAlbumName = res.results[0].collectionName;
          Synth.displayTrack(
            trackId,
            trackArtist,
            trackTitle,
            trackImgUrl,
            trackAudioUrl,
            trackAppleMusicUrl,
            trackAlbumName,
          );
        } else {
          console.log("No results found for this track.");
        }
      })
      .catch((error) =>
        console.error("Error fetching or parsing JSON:", error),
      );
  }

  async getPlaylist<T = unknown>(playlist: string): Promise<T> {
    try {
      let response: Response;
      if (playlist.includes("pitchfork")) {
        response = await fetch(playlist);
      } else if (playlist.includes("custom")) {
        response = await fetch(`${githubPrefix + playlist}.json`);
      } else {
        response = await fetch(playlist); //apple music
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const ulElement = document.querySelector("ul");
      if (ulElement) {
        ulElement.innerHTML = "";
      }
      const data = await response.json();

      if (playlist.includes("pitchfork")) {
        const tracks = data.items;
        for (const track of tracks) {
          let finalSearchString = `${track.url}`;
          const parts = finalSearchString.split("/");
          finalSearchString = parts.pop() || "";
          finalSearchString = finalSearchString.replace(/-/g, " ");
          Playlist.itunesSearch(finalSearchString);
        }
      } else if (playlist.includes("custom")) {
        const tracks = data;
        for (const track of tracks) {
          const searchTerm = `${track.s} ${track.a}`;
          const finalSearchString = searchTerm.replace(/ /g, "+");
          Playlist.itunesSearch(finalSearchString);
        }
      } else {
        const tracks = data.feed.entry;
        for (const track of tracks) {
          const trackId = track.id.attributes["im:id"];
          const trackArtist = track["im:artist"].label;
          const trackTitle = track["im:name"].label;
          const trackImgUrl = track["im:image"][1].label;
          const trackAudioUrl = track.link[1].attributes.href;
          const trackAppleMusicUrl = track.id.label + publisherSlug;
          const trackAlbumName = track["im:collection"]["im:name"].label;
          Synth.displayTrack(
            trackId,
            trackArtist,
            trackTitle,
            trackImgUrl,
            trackAudioUrl,
            trackAppleMusicUrl,
            trackAlbumName,
          );
        }
      }
      return data as T;
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  connectedCallback() {
    console.log("playlist component added to DOM");
    const headerComponent = document.querySelector("header-component");
    if (headerComponent) {
      console.log("header component found");
      document.addEventListener("playlist-changed", (event) => {
        const selectedValue = (event as CustomEvent).detail.selectedValue;
        localStorage.setItem("lastListenedTo", selectedValue);
        console.log("Selected value from playlist:", selectedValue);
        this.getPlaylist(selectedValue);
        //Boom.getTracks(selectedValue);
      });
    } else {
      console.warn("header component not found");
    }
  }
}
customElements.define("playlist-component", Playlist);

class TrackPanel extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
    <li> </li>
    `;
    this.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return [
      "track-artist",
      "track-title",
      "track-img-url",
      "track-audio-url",
      "track-apple-music-url",
      "track-album-name",
    ];
  }

  connectedCallback(): void {
    console.log("track-panel component added to DOM");
    this.setAttribute("track-artist", "Unknown Artist");
    this.setAttribute("track-title", "Unknown Title");
    this.setAttribute("track-img-url", "https://via.placeholder.com/60");
    this.setAttribute("track-audio-url", "https://example.com/audio.mp3");
    this.setAttribute(
      "track-apple-music-url",
      "https://example.com/apple-music",
    );
    this.setAttribute("track-album-name", "Unknown Album");
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const li = this.querySelector("li")!;
    li.setAttribute("data-id", "track-id-placeholder");
    const trackArtist = this.getAttribute("track-artist") || "Unknown Artist";
    const trackTitle = this.getAttribute("track-title") || "Unknown Title";
    const trackImgUrl =
      this.getAttribute("track-img-url") || "https://via.placeholder.com/60";
    const trackAudioUrl =
      this.getAttribute("track-audio-url") || "https://example.com/audio.mp3";
    const trackAppleMusicUrl =
      this.getAttribute("track-apple-music-url") ||
      "https://example.com/apple-music";
    const trackAlbumName =
      this.getAttribute("track-album-name") || "Unknown Album";

    //generateTrackPanel: function generateTrackPane do this here
  }
}
customElements.define("track-panel", TrackPanel);

const Synth = {

  displayTrack: function displayTrack(
    trackId: string,
    trackArtist: string,
    trackTitle: string,
    trackImgUrl: string,
    trackAudioUrl: string,
    trackAppleMusicUrl: string,
    trackAlbumName: string,
  ) {
    //console.log("in displayTrack");
    const li = document.createElement("li");
    li.setAttribute("data-id", trackId);
    document.querySelector("ul")?.appendChild(li);
    Synth.generateTrackPanel({
      li,
      trackArtist,
      trackAudioUrl,
      trackTitle,
      trackImgUrl,
      trackAppleMusicUrl,
      trackAlbumName,
    });
  },

  generateTrackPanel: function generateTrackPanel({
    li,
    trackArtist,
    trackTitle,
    trackImgUrl,
    trackAudioUrl,
    trackAppleMusicUrl,
    trackAlbumName,
  }: {
    li: HTMLLIElement;
    trackArtist: string;
    trackTitle: string;
    trackImgUrl: string;
    trackAudioUrl: string;
    trackAppleMusicUrl: string;
    trackAlbumName: string;
  }) {
    const audio = document.createElement("audio");
    audio.setAttribute("type", "audio/mpeg");
    audio.setAttribute("src", trackAudioUrl);
    audio.setAttribute("controls", "");
    audio.setAttribute("preload", "auto");
    audio.setAttribute("loop", "false");

    const link = document.createElement("a");
    link.setAttribute("href", trackAppleMusicUrl);
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("target", "_blank");
    link.setAttribute("title", trackTitle);

    const amImage = document.createElement("img");
    amImage.setAttribute("alt", "Apple Music");
    amImage.setAttribute("class", "am");
    amImage.setAttribute("src", "../img/apple-music-compact.svg");
    amImage.setAttribute("title", "Lsten on Apple Music");

    const img = document.createElement("img");
    img.setAttribute("loading", "lazy");
    img.setAttribute("alt", "album cover");
    img.setAttribute("class", "album");
    img.setAttribute("src", trackImgUrl);
    img.setAttribute("title", trackAlbumName);
    img.setAttribute("height", "60");
    img.setAttribute("width", "60");

    const h3 = document.createElement("h3");
    h3.setAttribute("class", "artist");
    const h3Node: Text = document.createTextNode(trackArtist);
    if (h3) {
      h3.appendChild(h3Node);
    }

    const h4 = document.createElement("h4");
    h4.setAttribute("class", "title");
    const h4Node: Text = document.createTextNode(trackTitle);
    if (h4) {
      h4.appendChild(h4Node);
    }

    link.appendChild(img);
    link.appendChild(h3);
    link.appendChild(h4);
    console.log(li);
    li.appendChild(link);
    li.appendChild(audio);
    //console.trace();
    li.appendChild(amImage);
    document.querySelector("ul")?.appendChild(li);
  },

  update: () => {
    requestAnimationFrame(Synth.update);
    analyser.getByteFrequencyData(frequencyData);
    Array.from(document.querySelectorAll("#viz > div")).forEach(
      (bar, index) => {
        const barHeightPerc = frequencyData[index] / 256;
        const r = Math.floor(barHeightPerc * 255);
        const g = 255 + Math.floor(barHeightPerc * 255);
        const b = 255 - Math.floor(barHeightPerc * 255);
        (bar as HTMLElement).style.height = `${barHeightPerc * 25}px`;
        (bar as HTMLElement).style.backgroundColor = `rgb(${r},${g},${b})`;
      },
    );
  },

  setCurrentAudio: (currentAudio: HTMLAudioElement) => {
    // @ts-ignore
    sourceNode = context.createMediaElementSource(currentAudio);
    // @ts-ignore
    sourceNode.connect(analyser);
    analyser.connect(context.destination);
    analyser.getByteFrequencyData(frequencyData);
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      const div = document.createElement("div");
      div.style.left = `${i * barSpacingPercent}%`;
      visualisation?.appendChild(div);
    }
    Synth.update();
  },
}; // Closing brace for Boom object

const boomer = new Boomer(); //Esiason or Berman

document.addEventListener(
  "play",
  (ag) => {
    const audios = document.getElementsByTagName("audio");
    for (const audio of audios) {
      //Synth.setCurrentAudio(audio);
      if (audio !== ag.target) {
        audio.pause();
      } else {
        Synth.setCurrentAudio(audio as HTMLAudioElement);
        //Synth.setCurrentAudio(audio); ?
      }
    }
  },
  true,
);

window.addEventListener("load", () => {
  console.log("boom! lets go...");
});
