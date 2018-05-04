const fetch = require('node-fetch')
const { send } = require('micro')
const micro = require('micro');
const fetchRetry = require('fetch-retry');

const fs = require('fs');
const path = require('path');
const document = path.join(__dirname, 'index.html');
const html = fs.readFileSync(document);
const server = micro(async (req, res) => {
  console.log('Serving index.html')
  res.end(html)
});
server.listen(8080);
module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // offset = 0 ... 237275 at every 25
  var database_usda_url = "http://localhost:4000?url=https://ndb.nal.usda.gov/ndb/search/list?offset=";
  var database_upc = []
  for (var offset = 0; offset < 25; offset = offset + 25) {
    var offset_url = database_usda_url+offset.toString();
    const response = await fetch(offset_url);
    const data = await response.json();
    for (var index = 0; index < data.upc_list.length; index++){
      if(data.url_list[index]){
        database_upc.push(data.url_list[index]);
      }
    }
  }


  var result = []
  var database_upc_url = "http://localhost:5000?url=";
  for (var upc_index = 0; upc_index < database_upc.length; upc_index++) {
    var upc_url = database_upc_url+database_upc[upc_index].toString();
    const response = await fetchRetry(upc_url, {retries: 3, retryDelay: 1000, retryOn: [503]});
    const data = await response.json();
    result.push(data);
  }
  console.log(result);
  send(res, 200, result);
}
