/**
 * Created by lema on 2018/2/13.
 */
require("./mongoose_db.js");
const moment = require('moment');
const bodyParser = require('body-parser');


const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Item = require('./mongoose_db').Item;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hello World!');
});


// TEST API, return all of the records
app.get('/all', (req, res, next) => {
    // get all records

    Item.find({}, (err, docs) => {
        if (err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong");
        } else {
            console.log(docs.length);
            var resArr = [];
            for (var i = 0; i < docs.length; i++) {
                console.log('title:', docs[i].title);

                var item_res = {
                    title: docs[i].title,
                    artist: docs[i].artist,
                    artist_url: docs[i].artist_url,
                    publish_date: docs[i].publish_date,
                    downloads:docs[i].downloads,
                    views: docs[i].views,
                    favourited:docs[i].favourited,
                    thanks: docs[i].thanks,
                    description:docs[i].description,
                    url: docs[i].url,
                    tags: docs[i].tags,
                    types:docs[i].types,
                    category: docs[i].category,
                    game_version: docs[i].game_version,
                    preview_image: docs[i].preview_image,
                    pack_requirement: docs[i].pack_requirement,
                    comments_cnt: docs[i].comments_cnt,
                    comments: docs[i].comments,
                    files: docs[i].files,
                    time_series_data: docs[i].time_series_data,
                }

                resArr.push(item_res);
            }
            res.json(resArr);
        }
    });
});


app.get('/traits', (req, res, next) => {
    console.log("called");

    // filter for tags that appear more than 30 times
    Item.find({category : 'Overrides - Tuning Mods'}).limit(30).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong");
        } else {
            console.log("called3");
            console.log(docs);
            var resArr = [];
            for(var i = 0; i < docs.length; i++) {
                console.log(':', docs[i].title);
                var item_res = {
                    title: docs[i].title,
                    artist: docs[i].artist,
                    artist_url: docs[i].artist_url,
                    publish_date: docs[i].publish_date,
                    downloads:docs[i].downloads,
                    views: docs[i].views,
                    favourited:docs[i].favourited,
                    thanks: docs[i].thanks,
                    description:docs[i].description,
                    url: docs[i].url,
                    tags: docs[i].tags,
                    types:docs[i].types,
                    category: docs[i].category,
                    game_version: docs[i].game_version,
                    preview_image: docs[i].preview_image,
                    pack_requirement: docs[i].pack_requirement,
                    comments_cnt: docs[i].comments_cnt,
                    comments: docs[i].comments,
                    files: docs[i].files,
                    time_series_data: docs[i].time_series_data,
                }
                resArr.push(item_res);
            }
            res.end(JSON.stringify(resArr));
        }
    });
});

// return number of created records per month

app.get('/numberOfRecordsByMonth', (req, res, next) => {
    console.log("numberOfRecordsByMonth _ called");
    const data = {};

    Item.find({}).sort({'publish_date' : -1}).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong");
            // res.end(err);
        } else {

            docs.forEach((doc) => {
                const key = moment(doc.publish_date).format("MMM YYYY");
                data[key] = data[key] === undefined ? 1 : data[key]+1;
            })

            const r = [];

            Object.keys(data).forEach(key => {
                // console.log(key);          // the name of the current key.
                // console.log(myObj[key]);   // the value of the current key.
                const item = {
                    "time": key,
                    "num": data[key]
                };

                r.push(item);
            });

            res.json(r);
        }
    });
});


// return apperance time per tag
// in certain time (TODO)
app.get('/downloadsOfKey', (req, res, next) => {

    const data = {};

    // probably can just query for tags
    Item.find({}).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong");
        } else {
            docs.forEach(doc => {
                if (doc.tags !== null && doc.tags.length !== 0) {
                    doc.tags.forEach(tag => {
                        const key = tag.toLowerCase();
                        data[key] = data[key] === undefined ? 1 : data[key]+1;
                    })
                }
            })

            const r = [];
            Object.keys(data).forEach(key => {
                if (data[key] < 20)
                    return;

                const item = {
                    "name": key,
                    "value": data[key]
                };

                r.push(item);
            });
            res.json(r);
        }
    });
});

// returns top mods with certain tag between certain time
app.get('/topmodswithtag', (req, res, next) => {

    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    const keywords = req.query.keywords

    const startDate = new Date(startTime*1000);
    const endDate = new Date(endTime*1000);
    // console.log(startTime);
    // console.log(endTime);
    // console.log(keywords);

    const data = {};

    // probably can just query for tags
    Item.find({ 
            tags: keywords,
            publish_date: {
                $gte: startDate,
                $lte: endDate
            } 
        }).sort({'downloads': -1}).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong");
        } else {
            res.json(docs);
        }
    });
});

app.get('/getTimeRangeThreshold', (req, res,next) => {
    console.log("getTimeRangeThreshold _ called");
    var data = [];

    Item.find({}).sort({'publish_date' : -1}).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong -- geTimeRangeThreshold");
        }else {
            docs.forEach((doc) => {
                const key = moment(doc.publish_date).format("MMM YYYY");
                if(!data.includes(key)) {
                    data.push(key);
                    console.log(key);
                }
            });
        }
        res.json(data);
    });
    console.log(" data for time range!");
    console.log(JSON.stringify(data));
});


app.post('/getKeyWordWithThreshold', (req, res,next) => {
    console.log("getKeyWordWithThreshold _ called");

    console.log( req);

    var startTime = new Date(req.body.startTime);
    var endTime = new Date(req.body.endTime);

    console.log("startTime :" + startTime);
    console.log("endTime : " + endTime);

    var data = {};

    Item.find({'publish_date': {
        "$gte": startTime,
        "$lt": endTime,
    }}).exec((err, docs) => {
        if(err) {
            console.log(err);
            res.status(504).send("Oh uh, something went wrong -- geTimeRangeThreshold");
        }else {
            docs.forEach(doc => {
                if (doc.tags !== null && doc.tags.length !== 0) {
                    doc.tags.forEach(tag => {
                        const key = tag.toLowerCase();
                        data[key] = data[key] === undefined ? 1 : data[key]+1;
                    })
                }
            })
            var r = Object.entries(data).sort((a,b) => b[1]- a[1]).slice(0, 10);
            var ret = [];
            for(i in r) {
                var cur = {
                    'name' : r[i][0],
                    'value' : r[i][1]
                }
                console.log(cur);
                ret.push(cur);
            }

            console.log(" data for time range!");
            console.log(r);
            res.end(JSON.stringify(ret));
        }

    })
});







app.listen(3000, () => console.log('dbserver listening on port 3000!'))

