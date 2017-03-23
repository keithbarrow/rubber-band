const HOST = '192.168.10.98:9200';
const ALL = '_all';
const elasticsearch = require('elasticsearch');

let version = null;
let client = new elasticsearch.Client({
    host: HOST,
    log: 'trace'
});


function getVersion() {
    return client.info().then(function (body) {
        //var hits = body.hits.hits;
        version = body.version;
        console.log('*******************************************');
        console.log(version.number);
        console.log('*******************************************');
    });
}

function ping(){
    return client.ping()
        .then(function(response){
            console.log('response = ' + response);
        });
}

function catIndices(){
    return client.cat.indices()
        .then(function(response){
           console.log(response);
        });
}

function search() {

    return client.search({
        index: 'logstash-2017.03.15',
        type: 'redis-input',
        query: {
            //https://www.elastic.co/guide/en/elasticsearch/reference/2.0/query-filter-context.html
            "filter": [
                {"term": {"Category": "Javascript"}}
            ]
        }

    })
        .then(function(responses) {
            var foo = responses.hits.hits.map(function(hit){
                return hit['_source'];
            });
            debugger;
            console.log(resp);
        });
}


// function search() {
//     // client.search({
//     //     index:'logstash-2017.02.28',
//     //     fields : ['_source'],
//     //     query: {
//     //         filtered: {
//     //
//     //             // query: {
//     //             //     "match_all": {}
//     //             // },
//     //             // filter: {
//     //             //     and : [
//     //             //         {term: {Environment:'Live'}},
//     //             //         {term: {Category:'Javascript'}},
//     //             //         {term: {"data.additional.product":'bingo-app'}}
//     //             //     ]
//     //             // }
//     //         }
//     //     }
//     // }).then(body => {
//     //     //var hits = body.hits.hits;
//     //     console.log(body.hits.hits);
//     //     console.log(body.hits.total);
//     // });
// }

getVersion()
    .then(ping)
    .then(catIndices)
    .then(search)
    .catch(error => {
    console.error(error.message);
});