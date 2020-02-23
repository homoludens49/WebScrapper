 const express = require('express');
 const cors = require('cors');
 const morgan = require('morgan');
 const bodyParser = require('body-parser');
 const fetch = require('node-fetch')
 const cheerio = require('cheerio')
 
 const app = express();
 
 app.use(cors());
 app.use(morgan('tiny'));
 app.use(bodyParser.json())

 function getResults(body){
     const $ = cheerio.load(body)
     const rows = $('li.result-row');
     const results = [];

     rows.each((index, element)=>{
        const result = $(element);
        const title = result.find('.result-title').text();
        const price = $(result.find('.result-price').get(0)).text();
        const imageData = result.find('a.result-image').attr('data-ids')
        let images =[]
        if(imageData){
            const parts = imageData.split(',')
            images = parts.map((id)=> {
                return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`
            })
        }
        // const hood = result.find('.result-hood').text().trim().replace('(' ,'').replace(')' ,'');
        let hood = result.find('.result-hood').text();
        if(hood){
            hood = hood.match(/\((.*)\)/)[1];
        }

        results.push({
            title,
            price,
            images,
            hood
        })
    })
    return results;
 }
 
 
 app.get('/', (req,res)=>{ 
     console.log('bash message')
     res.json({
     message: "server is up up up , client message"
 })
 })

app.get('/search/:location/:search_term', (req,res)=>{
    const { location, search_term } = req.params

    const url = `https://${location}.craigslist.org/search/sss?query=${search_term}&sort=date`;

    fetch(url)
        .then(res => res.text())
        .then(body => {
            const results = getResults(body);
        res.json({
                results
            })
        })

    // console.log(req.params)
    
})

 app.use((req, res, next)=>{
     const error = new Error('not found')
     res.status(404)
     next(error)
 });
 app.use((error, req, res, next)=>{
     res.status(res.statusCode || 500)
     res.json({
         message: error.message
     })
 })
 
 app.listen(3000, ()=> (console.log('listening on 3000')))