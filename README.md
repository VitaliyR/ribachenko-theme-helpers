# Ribachenko Theme Helpers

Collection of Handlebars helpers for [the theme](https://github.com/VitaliyR/ribachenkotheme) for my blog running on 
[Ghost](https://ghost.org/).

Right now it only contains a helper for retrieving from foursquare my last checkin.

## Installation

* Clone this repo into **./content/apps**
* Run `npm i`
* Until Ghost release the apps, add it manually in the DB in **Settings** table, at **application** row
* Add into Ghost config, which is located in the root folder of Ghost installation, next fields:
```json
"foursquare": {
  "url": "https://api.foursquare.com/v2/users/self/checkins?limit=1&v=20160211&oauth_token=PUT_HERE_YOUR_AUTH_TOKEN",
  "userId": "PUT_HERE_YOUR_USER_ID"
}
```
