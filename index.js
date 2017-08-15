const App = require('ghost-app');
const fs = require('fs-extra');
const request = require('request-promise');

const configFile = {
  prod: './config.production.json',
  dev: './config.development.json'
};
const customDataFile = './customData.json';
const cacheTime = 1000 * 60 * 10;

let config;

module.exports = App.extend({
  install: function() {
  },

  uninstall: function() {
  },

  activate: function() {
    try {
      config = JSON.parse(fs.readFileSync(configFile.prod, { encoding: 'utf-8' }));
    } catch (e) {
      config = JSON.parse(fs.readFileSync(configFile.dev, { encoding: 'utf-8' }));
    }

    this.app.helpers.registerAsync('last_checkin', this.lastCheckinHelper)
  },

  deactivate: function() {
  },

  lastCheckinHelper: function(options) {
    return fs.readFile(customDataFile)
      .then(contents => JSON.parse(contents))
      .catch(() => {
        return {};
      })
      .then((data) => {
        if (!data.foursquare) {
          data.foursquare = {
            executed: 0
          };
        }

        const now = Date.now();

        if ((now - cacheTime) > data.foursquare.executed) {
          return request(config.foursquare.url).then((response) => {
            if (!response) {
              return data.foursquare.executed ? options.fn(data.foursquare.data) : options.inverse();
            }

            const res = JSON.parse(response).response;

            data.foursquare.data = res.checkins.items[0];
            data.foursquare.data.userId = config.foursquare.userId;
            data.foursquare.executed = now;

            return fs.writeFile(customDataFile, JSON.stringify(data)).then(() => {
              return options.fn(data.foursquare.data);
            });
          });
        } else {
          return options.fn(data.foursquare.data);
        }
      })
      .catch(() => options.inverse());
  }
});
