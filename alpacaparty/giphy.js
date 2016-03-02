'use strict';

const fetch = require('node-fetch');
const Promise = require('bluebird');

const giphy = {
  getRandomAlpacaGifs: (count) => {
    return new Promise((resolve, reject) => {
      giphy
        .getAlpacaGifs()
        .then((gifs) => {
          gifs.sort(() => {
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
          resolve(gifs.slice(0, count));
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getAlpacaGifs: () => {
    return new Promise((resolve, reject) => {
      var url = 'http://api.giphy.com/v1/gifs/search?';
      var searchTerm = 'alpaca';
      var limit = 50;
      var offset = 0;

      url += [
        'q=' + searchTerm,
        'limit=' + limit,
        'offset=' + offset,
        'api_key=dc6zaTOxFJmzC'
      ].join('&');

      fetch(url)
        .then((response) => {
          response
            .json()
            .then((json) => {
              resolve(json.data.map((result) => {
                return result.images.fixed_height.url;
              }));
            })
            .catch((err) => {
              reject(err);
            });
        });
    });
  }
};

module.exports = giphy;

