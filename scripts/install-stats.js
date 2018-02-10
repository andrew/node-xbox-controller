// install-stats v1.0.6
// Copyright (C) 2018 Andrew Nesbitt
// https://github.com/andrew/install-stats
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

try {
  var user_agent = process.env.npm_config_user_agent.split(/[\s\/]+/)

  var params = {
    v:   1,
    tid: process.env.TID,
    aip: 1,
    t:   'event',
    ec:  'install',
    ea:  process.env.npm_package_name,
    el:  process.env.npm_package_version,
    ua:  'install-stats-1.0.6',
    an:  'install-stats',
    av:  '1.0.6',
    z:   Math.floor(Math.random()*20000000000),
    cid: new Buffer(process.env.npm_config_tmp).toString('base64'),
    cd1: user_agent[3], // node version
    cd2: user_agent[1], // npm version
    cd3: user_agent[4], // operating system
    cd4: user_agent[5]  // architecture
  };

  var url = "https://www.google-analytics.com/collect?";
  for (var key in params) {
    url += "&" + key + "=" + encodeURIComponent(params[key]);
  }

  require('https').get(url);
} catch (e) {}
