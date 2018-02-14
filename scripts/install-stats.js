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
  var tmp_path = process.env.npm_config_tmp || process.env.TMPDIR;

  if(user_agent.length > 6) { // yarn useragent is longer
    var cd1 = user_agent[5]
    var cd2 = user_agent[0]+'-'+user_agent[1]
    var cd3 = user_agent[6]
    var cd4 = user_agent[7]
  } else {
    var cd1 = user_agent[3]
    var cd2 = user_agent[1]
    var cd3 = user_agent[4]
    var cd4 = user_agent[5]
  }

  var params = {
    v:   1,
    tid: 'UA-265870-43',
    aip: 1,
    t:   'event',
    ec:  'install',
    ea:  process.env.npm_package_name,
    el:  process.env.npm_package_version,
    ua:  'install-stats-1.0.6',
    an:  'install-stats',
    av:  '1.0.6',
    z:   Math.floor(Math.random()*20000000000),
    cid: require('crypto').createHash('md5').update(tmp_path).digest("hex"),
    cd1: cd1, // node version
    cd2: cd2, // npm version
    cd3: cd3, // operating system
    cd4: cd4  // architecture
  };

  var url = "https://www.google-analytics.com/collect?";
  for (var key in params) {
    url += "&" + key + "=" + encodeURIComponent(params[key]);
  }

  require('https').get(url);
} catch (e) {}
