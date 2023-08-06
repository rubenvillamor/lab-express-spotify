require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => res.render("index"));

app.get("/artist-search", (req, res, next) => {
  let searchArtist = req.query.search;
  if (searchArtist !== "") {
    spotifyApi
      .searchArtists(searchArtist)
      .then((data) => {
        console.log("The received data from the API: ", data.body);
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render("artist-search-results.hbs", {
          data: data.body,
          dataSearch: searchArtist,
        });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
  } else {
    // no hagas nada
  }
});

app.get("/albums/:id", (req, res, next) => {
  let artistID = req.params.id;
  spotifyApi
    .getArtistAlbums(artistID)
    .then((data) => {
      console.log("Artist albums", data.body);
      res.render("albums.hbs", {
        albums: data.body,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/tracks/:id", (req, res) => {
  let trackId = req.params.id;
  spotifyApi
    .getAlbumTracks(trackId)
    .then((data) => {
      console.log(data.body);
      res.render("tracks.hbs", {
        tracks: data.body,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
