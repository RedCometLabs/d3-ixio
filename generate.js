var fs = require('fs'),
csv = require('csv'),
nano = require('nano')(process.env['CLOUDANT']);

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


csv().from.path(__dirname + '/ixio_jsinsa_data.csv', { delimiter: ';', escape: '"' }).on('record', function (row, i) {

  if (i === 0) { return; } //skip headers
  var item = {
    "number": row[0],
    "age": row[1],
    "language": row[2],
    "culturalProfile" : row[3],
    "gender": row[4],
    "province": row[6],
    "income": row[6],
    "favouredProduct": row[7],
    "joinYear": row[8],
    "overdue": row[9],
    "currentMOP": row[10],
    "ClusterGroup": row[11]
  };

  db.insert(item, function (err, resp) {
    console.log('db', err, resp);
           
  });

  //console.log(item);
 // console.log(row, i);
});
