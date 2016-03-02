'use strict';

const Boom = require('boom')
const Hapi = require('hapi');
const Vision = require('vision');
const Handlebars = require('handlebars');
const Inert = require('inert');
const Path = require('path');

const Giphy = require('./giphy');
const YouTube = require('./youtube');

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'static')
      }
    }
  }
});
server.connection({
  port: 3000
});

server.register(Vision, (err) => {
  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: 'templates'
  });
});

server.register(Inert, (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/static/{filename}',
    handler: {
      file: (request) => {
        return request.params.filename;
      }
    }
  });
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    var completeCount = 0;
    var partyMusicId;
    var alpacaImages;

    YouTube.getRandomPartyMusic()
      .then((videoId) => {
        partyMusicId = videoId;
        tryReply();
      });

    Giphy
      .getRandomAlpacaGifs(1)
      .then((gifs) => {
        var alpacas = gifs.map((gif) => {
          return {
            url: gif
          };
        });
        alpacaImages = alpacas;
        tryReply();
      })
      .catch((err) => {
        reply(Boom.wrap(err, err.status));
      });


      const tryReply = () => {
        if (++completeCount === 2) {
          reply.view('index', {
            alpacas: alpacaImages,
            music: partyMusicId
          });
        }
      }
  }
});

server.route({
  method: 'GET',
  path: '/alpaca',
  handler: (request, reply) => {
    Giphy
      .getRandomAlpacaGifs(1)
      .then((gifs) => {
        var alpacas = gifs.map((gif) => {
          return {
            url: gif
          };
        });

        reply(alpacas[0]);
      })
      .catch((err) => {
        reply(Boom.wrap(err, err.status));
      });
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at: 3000');
});
