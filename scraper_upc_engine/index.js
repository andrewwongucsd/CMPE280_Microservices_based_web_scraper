const { parse } = require('url')
const { send } = require('micro')
// const { json } = require('micro')
const got = require('got');
const cheerio = require('cheerio');
const fetch = require('fetch-retry-or-die');
// const metascraper = require('metascraper')
// const cache = require('memory-cache')

// const TWENTY_FOUR_HOURS = 86400000

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const { query: { url } } = parse(req.url, true)
  if (!url) return send(res, 401, { message: 'Please supply an URL to be scraped in the url query parameter.' })
  // let statusCode, data


  const { body: html, statusCode: code } = await got(url);

  // const response = await got(url);
  // console.log(response);
  // var response = await fetch(url, {
  //   maxRetries: 3,
  //   retryDelay: 10000
  // });
  // console.log(response);
  // var html = response.body;
  // const { body: html, statusCode: code } = await got(url).on('error', function(error){
  //   console.log("error "+error);
  // }, function(body){
  //   console.log("body "+body);
  // }, function(response){
  //   console.log(response);
  // });

  // if(code != 200){
  //   console.log("code: "+code.toString());
  //   send(res, 200, {status: "error"});
  //   return;
  // }
  // const content = await got(url);
  // console.log(content);
  // var json = JSON.parse(html);

  var $ = cheerio.load(html);
  var json = {};
  json['status'] = "OK";
  // json['upc'] = req.url.match(/\d{12}/g)[0];
  // json['product_name'] = $().attr('title');
  // json['description'] = $('.product-text').text();
  // json['unit'] = $('#uom').text();
  var split = $('.bodywrapper > .wbox > .container').text().split('\n');
  // console.log(split[5].trim());
  // console.log(split[101].trim());
  // console.log(split[14].trim());
  var line_5 = split[5].trim().split(',');
  var product_name = line_5[line_5.length - 2].trim();
  var upc = line_5[line_5.length - 1].trim().split(":")[1];
  var manufacturer = split[14].trim();
  var ingredients = split[101].trim();

  // split.forEach(function(index, element){
  //   console.log(index+" --> ");
  //   console.log(element);
  // });
  json['manufacturer'] = manufacturer.trim();
  json['product_name'] = product_name.trim();
  // json['brand_name'] = brand_name;
  json['upc'] = upc.trim();
  json['ingredients'] = ingredients.trim();

  console.log(json);
  send(res, 200, json);


}
