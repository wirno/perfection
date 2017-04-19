var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');

url = "http://www.transparency.org/whatwedo/publications";
var pageVisited = []
var pageToVisit = []

var tab = {}

var maxPageToVisit = 100;
var numberPageVisited = 0;
pageToVisit.push(url);


var urlObject = new URL(url);
var domainName = urlObject.protocol + "//" + urlObject.hostname;

crawl();

function crawl(){

  if(numberPageVisited >= maxPageToVisit) {
    console.log("limite atteinte");
    fs.writeFile('link.json', JSON.stringify(tab, null, 4), function(err){
    console.log('File successfully written! - Check your project directory for the link.json file');
    })
    return;
  }

  var nextPage = pageToVisit.pop();
  if(nextPage in pageVisited){
    crawl();
  }
  else{
    visitPage(nextPage, crawl);
  }
}
function visitPage(url, callback){
  pageVisited[url] = true;
  numberPageVisited++;
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      data = collectLinks($, true)
      tab[url] = data;
      callback();
    }
  });
}

function collectLinks($) {
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];
    var AllLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
      var href = $(this).attr('href');
      var urlObjectFromHref = new URL(href);
      var domainNameFromHref = urlObjectFromHref.protocol + "//" + urlObjectFromHref.hostname;
      if(domainNameFromHref == domainName){
        allRelativeLinks.push(href);
        pageToVisit.push(href);
      }
    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function() {
      var href = $(this).attr('href');
      var urlObjectFromHref = new URL(href);
      var domainNameFromHref = urlObjectFromHref.protocol + "//" + urlObjectFromHref.hostname;
      if(domainNameFromHref == domainName){
        allAbsoluteLinks.push(href);
        pageToVisit.push(href);
      }
    });

    AllLinks.push(allRelativeLinks);
    AllLinks.push(allAbsoluteLinks);
    return AllLinks;
}
