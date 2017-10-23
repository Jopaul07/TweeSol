var fs = require('fs');

var csv = require('fast-csv');
var stream = fs.createReadStream("./mycsv.csv");
var user_list = [];
csv
.fromStream(stream,{headers: true,ignoreEmpty: true})
.on("data", data => {
    user_list.push(data);
})
.on("end", () => {
    console.log(user_list);
  console.log(user_list[1].screen_name);
  // > 4187
});

