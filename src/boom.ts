const publisherSlug =
  "&itscg=30200&itsct=music_box_link&ls=1&app=music&mttnsubad=1667990774&at=11l6841";
const githubPrefix =
  "https://raw.githubusercontent.com/rottina/boombastic/refs/heads/main/src/playlists/";
const itunesApiPrefix =
  "https://itunes.apple.com/search?limit=1&media=music&entity=song&term=";
const defaultPlaylist =
  "https://itunes.apple.com/us/rss/topsongs/limit=25/genre=18/explicit=true/json";

class Boomer {
  // public lastListenedTo: string;
  constructor() {
    //this.populateSelector();
    this.getTracks(defaultPlaylist);
  }
  getTracks(playlist: string) {
    console.log(playlist);
    if (playlist.includes("pitchfork")) {
      console.log("pitchfork");
    } else if (playlist.includes("custom")) {
      console.log("custom");
    } else {
      console.log("default");
    }
  }
}

class Header extends HTMLElement {
  populateSelector() {
    console.log("in populateSelect");
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
          selector.appendChild(optionElement);
        }
      });
  }

  connectedCallback() {
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
      //localStorage.setItem("lastListenedTo", selectedValue);
      // console.log(`changed lastListenedTo: ${selectedValue}`);
      // Boom.getTracks(selectedValue);
    });
  }

  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
    <header>
        <h1>B<span class="o1">o</span><span class="o2">o</span>mbastic<span class="o2"> !</span></h1>
        <h2>Discover and preview popular tracks on the web.</h2>
        <div id="visualisation" class="hideIfNoApi">
          <div style="left: 0%; height: 0"></div><div style="left: 3.125%; height: 0"></div><div style="left: 6.25%; height: 0"></div><div style="left: 9.375%; height: 0"></div><div style="left: 12.5%; height: 0"></div><div style="left: 15.625%; height: 0"></div><div style="left: 18.75%; height: 0"></div><div style="left: 21.875%; height: 0"></div><div style="left: 25%; height: 0"></div><div style="left: 28.125%; height: 0"></div><div style="left: 31.25%; height: 0"></div><div style="left: 34.375%; height: 0"></div><div style="left: 37.5%; height: 0"></div><div style="left: 40.625%; height: 0"></div><div style="left: 43.75%; height: 0"></div><div style="left: 46.875%; height: 0"></div><div style="left: 50%; height: 0"></div><div style="left: 53.125%; height: 0"></div><div style="left: 56.25%; height: 0"></div><div style="left: 59.375%; height: 0"></div><div style="left: 62.5%; height: 0"></div><div style="left: 65.625%; height: 0"></div><div style="left: 68.75%; height: 0"></div><div style="left: 71.875%; height: 0"></div><div style="left: 75%; height: 0"></div><div style="left: 78.125%; height: 0"></div><div style="left: 81.25%; height: 0"></div><div style="left: 84.375%; height: 0"></div><div style="left: 87.5%; height: 0"></div><div style="left: 90.625%; height: 0"></div><div style="left: 93.75%; height: 0"></div><div style="left: 96.875%; height: 0"></div>
        </div>
        <select></select>
      </header>
    `;
    this.appendChild(template.content.cloneNode(true));
    this.populateSelector();
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
  async getPlaylist<T = unknown>(playlist: string): Promise<T> {
    //console.log(playlist);
    if (playlist.includes("pitchfork")) {
      try {
        const response = await fetch(`${playlist}`);
        console.log(`pfork playlist ${playlist}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const parent = document.querySelector("ul");
        if (parent) {
          parent.innerHTML = "";
        } //clear children
        const data = await response.json();
        const tracks = data.items;
        //console.dir(tracks);
        for (const track of tracks) {
          let finalSearchString = `${track.url}`;
          const parts = finalSearchString.split("/");
          finalSearchString = parts.pop() || "";
          finalSearchString = finalSearchString.replace(/-/g, " ");
          Boom.itunesSearch(finalSearchString);
        }
        return data as T; // Return the data as the generic type T
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        throw error;
      }
    } else if (playlist.includes("custom")) {
      try {
        const response = await fetch(`${githubPrefix + playlist}.json`);
        console.log(`bilboard playlist ${playlist}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const parent = document.querySelector("ul");
        if (parent) {
          parent.innerHTML = "";
        } //clear children
        const data = await response.json();
        const tracks = data;
        console.dir(tracks);
        for (const track of tracks) {
          const searchTerm = `${track.s} ${track.a}`;
          const finalSearchString = searchTerm.replace(/ /g, "+");
          console.log(`finalSearchString :::: ${finalSearchString}`);
          Boom.itunesSearch(finalSearchString);
        }
        return data as T; // Return the data as the generic type T
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        throw error;
      }
    } else {
      try {
        const response = await fetch(playlist);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const parent = document.querySelector("ul");
        if (parent) {
          parent.innerHTML = "";
        } //clear children
        const data = await response.json();
        const tracks = data.feed.entry;
        console.log(tracks.length);
        for (const track of tracks) {
          const trackId = track.id.attributes["im:id"];
          const trackArtist = track["im:artist"].label;
          const trackTitle = track["im:name"].label;
          const trackImgUrl = track["im:image"][1].label;
          const trackAudioUrl = track.link[1].attributes.href;
          const trackAppleMusicUrl = track.id.label + publisherSlug;
          const trackAlbumName = track["im:collection"]["im:name"].label;
          Boom.displayTrack(
            trackId,
            trackArtist,
            trackTitle,
            trackImgUrl,
            trackAudioUrl,
            trackAppleMusicUrl,
            trackAlbumName,
          );
          //break; // debug: Remove this break to display all tracks
        }
        return data as T; // Return the data as the generic type T
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        throw error;
      }
    }
  }
  connectedCallback() {
    console.log("playlist component added to DOM");
    const Header = document.querySelector("header-component");
    if (Header) {
      console.log("header component found");
      Header.addEventListener("playlist-changed", (event) => {
        const selectedValue = (event as CustomEvent).detail.selectedValue;
        console.log("Selected value from playlist:", selectedValue);
        this.getPlaylist(selectedValue);
        // localStorage.setItem("lastListenedTo", selectedValue);
        // console.log(`changed lastListenedTo: ${selectedValue}`);
        // Boom.getTracks(selectedValue);
      });
    }
  }
}
customElements.define("playlist-component", Playlist);

const Boom = {
  init: () => {
    const lastListenedTo = localStorage.lastListenedTo || defaultPlaylist;
    if (lastListenedTo) {
      console.log(`lastListenedTo: ${lastListenedTo}`);
      localStorage.lastListenedTo = lastListenedTo;
    } else {
      console.log("lastListenedTo is not set, using default playlist");
      localStorage.lastListenedTo = defaultPlaylist;
    }
    Boom.populateSelector();
    Boom.getTracks(lastListenedTo);
  },

  getTracks: async <T>(playlist: string): Promise<T | undefined> => {
    // //console.log(playlist);
    // if (playlist.includes("pitchfork")) {
    //   try {
    //     const response = await fetch(`${playlist}`);
    //     console.log(`pfork playlist ${playlist}`);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const parent = document.querySelector("ul");
    //     if (parent) {
    //       parent.innerHTML = "";
    //     } //clear children
    //     const data = await response.json();
    //     const tracks = data.items;
    //     //console.dir(tracks);
    //     for (const track of tracks) {
    //       let finalSearchString = `${track.url}`;
    //       const parts = finalSearchString.split("/");
    //       finalSearchString = parts.pop() || "";
    //       finalSearchString = finalSearchString.replace(/-/g, " ");
    //       Boom.itunesSearch(finalSearchString);
    //     }
    //     return data as T; // Return the data as the generic type T
    //   } catch (error: unknown) {
    //     console.error("Fetch error:", error);
    //     throw error;
    //   }
    // } else if (playlist.includes("custom")) {
    //   try {
    //     const response = await fetch(`${githubPrefix + playlist}.json`);
    //     console.log(`bilboard playlist ${playlist}.json`);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const parent = document.querySelector("ul");
    //     if (parent) {
    //       parent.innerHTML = "";
    //     } //clear children
    //     const data = await response.json();
    //     const tracks = data;
    //     console.dir(tracks);
    //     for (const track of tracks) {
    //       const searchTerm = `${track.s} ${track.a}`;
    //       const finalSearchString = searchTerm.replace(/ /g, "+");
    //       console.log(`finalSearchString :::: ${finalSearchString}`);
    //       Boom.itunesSearch(finalSearchString);
    //     }
    //     return data as T; // Return the data as the generic type T
    //   } catch (error: unknown) {
    //     console.error("Fetch error:", error);
    //     throw error;
    //   }
    // } else {
    //   try {
    //     const response = await fetch(playlist);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const parent = document.querySelector("ul");
    //     if (parent) {
    //       parent.innerHTML = "";
    //     } //clear children
    //     const data = await response.json();
    //     const tracks = data.feed.entry;
    //     console.log(tracks.length);
    //     for (const track of tracks) {
    //       const trackId = track.id.attributes["im:id"];
    //       const trackArtist = track["im:artist"].label;
    //       const trackTitle = track["im:name"].label;
    //       const trackImgUrl = track["im:image"][1].label;
    //       const trackAudioUrl = track.link[1].attributes.href;
    //       const trackAppleMusicUrl = track.id.label + publisherSlug;
    //       const trackAlbumName = track["im:collection"]["im:name"].label;
    //       Boom.displayTrack(
    //         trackId,
    //         trackArtist,
    //         trackTitle,
    //         trackImgUrl,
    //         trackAudioUrl,
    //         trackAppleMusicUrl,
    //         trackAlbumName,
    //       );
    //       //break; // debug: Remove this break to display all tracks
    //     }
    //     return data as T; // Return the data as the generic type T
    //   } catch (error: unknown) {
    //     console.error("Fetch error:", error);
    //     throw error;
    //   }
    // }
    return undefined;
  },

  itunesSearch: (finalSearchString: string) => {
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
          Boom.displayTrack(
            trackId,
            trackArtist,
            trackTitle,
            trackImgUrl,
            trackAudioUrl,
            trackAppleMusicUrl,
            trackAlbumName,
          );
        } else {
          console.log("No results found for the search term.");
        }
      })
      .catch((error) =>
        console.error("Error fetching or parsing JSON:", error),
      );
  },

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
    Boom.generateTrackPanel({
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
    li.appendChild(link);
    li.appendChild(audio);
    //console.trace();
    li.appendChild(amImage);
    document.querySelector("ul")?.appendChild(li);
  },

  populateSelector: async <T>(): Promise<T> => {
    console.log("in populateSelect");
    const optionsFile = "options.json";
    try {
      const response = await fetch(optionsFile);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const appleMusicPrefix =
        "https://itunes.apple.com/us/rss/topsongs/limit=25/";
      const opts = data.options;
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const selector = document.querySelector("select")!;
      for (const opt of opts) {
        const optionElement = document.createElement("option");
        if (opt.type === "appmus") {
          optionElement.value = appleMusicPrefix + opt.value;
        } else {
          optionElement.value = opt.value;
        }
        optionElement.textContent = opt.label;
        if (opt.type === "na") {
          optionElement.setAttribute("disabled", "disabled");
        }
        if (opts.value === localStorage.lastListenedTo) {
          optionElement.setAttribute("selected", "selected");
        }
        selector.appendChild(optionElement);
      }
      selector.addEventListener("change", (event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;
        console.log("Selected value:", selectedValue);
        localStorage.setItem("lastListenedTo", selectedValue);
        console.log(`changed lastListenedTo: ${selectedValue}`);
        Boom.getTracks(selectedValue);
      });
      return data as T; // Return the data as the generic type T
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
}; // Closing brace for Boom object

document.addEventListener(
  "play",
  (ag) => {
    const audios = document.getElementsByTagName("audio");
    for (const audio of audios) {
      if (audio !== ag.target) {
        audio.pause();
      }
    }
  },
  true,
);
const boomer = new Boomer();
window.addEventListener("load", (e) => {
  console.log("boom! lets go...");
});
