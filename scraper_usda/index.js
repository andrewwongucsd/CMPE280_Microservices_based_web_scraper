
const { parse } = require('url')
const { send } = require('micro')
const got = require('got');
var cheerio = require('cheerio');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { query: { url } } = parse(req.url, true)
  console.log(url);
  if (!url) return send(res, 401, { message: 'Please supply an URL to be scraped in the url query parameter.' })

  let statusCode, data
  // try {
  const { body: html } = await got(url);
  // data = html;
  // data = await metascraper({ url, html })
  var $ = cheerio.load(html);
  // var result = $('.odd').children().get(2).html();
  var upc_list = [];
  var upc_url_list = [];

  var odd_result = $('.odd a').text().split("UPC: ");
  var odd_result_list = $('.odd a');
  odd_result_list.each(function(index, element){
    if(element.attribs.href.indexOf("/ndb/foods/show/") >= 0 && index % 2 == 0){
      console.log(element.attribs.href);
      upc_url_list.push("https://ndb.nal.usda.gov"+element.attribs.href);
    }
  });
  odd_result.forEach(function(element){
    var upc = element.match(/\d{12}/g);
    if(upc != null){
      upc_list.push(upc[0]);
    }
  });
  var even_result =  $('.even a').text().split("UPC: ");
  var even_result_list = $('.even a');
  even_result_list.each(function(index, element){
    if(element.attribs.href.indexOf("/ndb/foods/show/") >= 0 && index % 2 == 0){
      console.log(element.attribs.href);
      upc_url_list.push("https://ndb.nal.usda.gov"+element.attribs.href);
    }
  });
  even_result.forEach(function(element){
    var upc = element.match(/\d{12}/g);
    if(upc != null){
      upc_list.push(upc[0]);
    }
  });

  console.log(upc_list);
  data = {upc_list: upc_list, url_list: upc_url_list};
  statusCode = 200;
  send(res, statusCode, data)
}
