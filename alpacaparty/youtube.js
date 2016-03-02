'use strict';

const fetch = require('node-fetch');
const Promise = require('bluebird');
const YouTube = require('youtube-node');

const youtube = {
  getRandomPartyMusic: () => {
    return new Promise((resolve, reject) => {
      youtube
        .getPartyMusicVideoIds()
        .then((videoIds) => {
          videoIds.sort(() => {
            var random = Math.random();
            if (random > 0.5) {
              return 1;
            }
            else if (random < 0.5) {
              return -1;
            }
            else {
              return 0;
            }
          });

          resolve(videoIds[0]);
        });
    });
  },

  getPartyMusicVideoIds: () => {
    return new Promise((resolve, reject) => {
      var yt = new YouTube();
      yt.setKey('AIzaSyAlvIRBIL-5z90iph9zAhzvG6wf50oOUm4');

      yt.search('techno party mix', 50, (err, results) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(results.items.map((video) => {
            return video.id.videoId;
          }));
        }
      });

    });
  }
};

module.exports = youtube;

