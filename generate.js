var fs = require('fs'),
csv = require('csv'),
nano = require('nano')(process.env['CLOUDANT']),
_ = require('underscore');

var db = nano.use('ixio-challenge');


/*csv()
  .from.path(__dirname+'/ixio_jsinsa_data.csv', { delimiter: ',', escape: '"' })
  .to.stream(fs.createWriteStream(__dirname+'/sample.out'))
  .transform( function(row){
  row.unshift(row.pop());
  return row;
  })
  .on('record', function(row,index){
  console.log('#'+index+' '+JSON.stringify(row));
  })
  .on('close', function(count){
// when writing to a file, use the 'close' event
// the 'end' event may fire before the file has been written
console.log('Number of lines: '+count);
})
.on('error', function(error){
console.log(error.message);
});*/


var clusterSize = {};

function addSizes (doc, info) {
  var cg = doc.ClusterGroup;
      if (!info[cg]) {
        info[cg] = {
          clusterGroup: cg,
          name: cg,
          size: 0,
          male: 0,
          female: 0,
          income: {
            unknown: 0,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            e: 0,
            f: 0,
            g: 0,
            h: 0,
            i: 0
          },
          language: {
            "English": 0,
            "Afrikaans": 0
          },
          culturalProfile: {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0
          },

          favouredProduct: {
            "Null": 0,
            "Product1":0,
            "Product2":0,
            "Product3":0,
            "Product4":0,
            "Product5":0,
            "Product6":0,
            "Product7":0,
            "Product8":0,
            "Product9":0,
            "Product10":0
          }
        };

        info[cg].joinYear = _.reduce(_.range(1985, 2014), function (group, year) {
          group[year.toString()] = 0;
          return group;
        }, {});
      }

      var group = info[cg];

      group.size += 1;
      var income = doc.income === "" ? "unknown" : doc.income.toLowerCase() ;
      group.income[income] += 1;
      group.joinYear[doc.joinYear] +=  1;
      group.language[doc.language] += 1;
      group.culturalProfile[doc.culturalProfile] += 1;
      group.favouredProduct[doc.favouredProduct] += 1;

      if (doc.gender === "Female") {
        group.female = group.female + 1;
      } else {
        group.male = group.male + 1;
      }
}


csv().from.path(__dirname + '/ixio_jsinsa_data.csv', { delimiter: ';', escape: '"' }).on('record', function (row, i) {

  if (i === 0) { return; } //skip headers
  var item = {
    "number": row[0],
    "age": row[1],
    "language": row[2],
    "culturalProfile" : row[3],
    "gender": row[4],
    "province": row[5],
    "income": row[6],
    "favouredProduct": row[7],
    "joinYear": row[8],
    "overdue": row[9],
    "currentMOP": row[10],
    "ClusterGroup": row[11]
  };

  addSizes(item, clusterSize);

  /*db.insert(item, function (err, resp) {
    console.log('db', err, resp);
           
  });*/

  //console.log(item);
 // console.log(row, i);
}).on('end', function () { 
  console.log('boom')
  console.log(JSON.stringify(_.values(clusterSize), null, ' '));
});
