var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

url = 'http://www.cinema-francais.fr/index_realisateurs/realisateurs_a.htm';
    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){
        var $ = cheerio.load(html);
        var real = $('p b a');

        var json = {"realisateur":[{"nom":"","prenom":""}]}


        real.each(function(i, element){
            var nomPrenom = $(this).text()

            console.log($(this).prev().text())
            var tabNomPrénom = nomPrenom.split(" ")

            var nom = tabNomPrénom[0]

            var prenom = tabNomPrénom[1]


            json.realisateur.push({"nom":nom,"prenom":prenom})

        })


            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        })
    })
        