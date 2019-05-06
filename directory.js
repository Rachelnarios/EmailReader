
var dir = require("node-dir");
var fileLine;
var fs = require("fs");
let converter = require("json-2-csv");


function main() {
  var jsonFile = []
try{
dir.files(process.argv[2], function(err, files) {
  try{
  if (err) throw err;
  for(f in files){
    var fileLine;
  //  console.log(files[f])
    fileLine = fs.readFileSync(files[f]).toString().match(/^.+$/gm);
//    console.log(fileLine)
  jsonFile.push(entry(fileLine));
  //console.log(jsonFile)
  }

  let json2csvCallback = function (err, csv) {
      if (err) throw err;
      var nam = process.argv[2].substring(0,3);
      try{
        var i = 0;
        while(fs.existsSync(nam+".csv")){
          nam = nam+i;
          if(fs.existsSync(nam)+".csv"=== false){
            break;
          }else{
            i++;
          }
        }
      }catch(e){}

      //console.log(nam);
      fs.writeFile (nam+".csv", csv, function(err) {
          if (err) throw err;
          console.log("complete");
        });
  };
 converter.json2csv(jsonFile, json2csvCallback);
}catch(e){
  console.log(e)
}

  });

}catch(e){
  console.log("no directory specified! Please specify the file name as such: node directory.js path/dirname")
}
}

function entry(file){
//console.log(file)
  let edgecase = true;
  let endbodyText;
  var item = {"Date": "",  "Comment":"", "Translation":"", "Device": ""}
  for(i in file){
    // console.log(file[i])
    if (file[i].includes("App Version") ){
      endbodyText = i;
      edgecase = false;
      break;
  }

}
if(edgecase == true){
  for(i in file){
  if (file[i].includes("</html>") ){
    endbodyText = i;
    break;
}
}}
// console.log("END"+endbodyText+edgecase)
  for(i in file){

    if (file[i].startsWith("Date") ){
      file[i]= file[i].replace(",","");
      file[i]= file[i].replace("Mon","");
      file[i]= file[i].replace("Tue","");
      file[i]= file[i].replace("Wed","");
      file[i]= file[i].replace("Thu","");
      file[i]= file[i].replace("Fri","");
      file[i]= file[i].replace("Sat","");
      file[i]= file[i].replace("Sun","");
      file[i]= file[i].replace(/<(?:.|\n)*?>/gm, "");
      item.Date = file[i].substring(6,file[i].indexOf("2019")+4);

    }
    if (file[i].includes("Device") ||file[i].includes("Model") ){
       file[i] = file[i].replace(/<(?:.|\n)*?>/gm, "");
       file[i]= file[i].replace("=20","");
       file[i]= file[i].replace("=3D","");
      item.Device = file[i].replace("=","");

    }
    if (file[i].includes("Content-transfer-encoding:") ){
      let text = ""

     for(var y = parseInt(i)+1; y < parseInt(i)+15 ;y++ ){
       text += (file[y]);
       if(file[y] == "</html>"  ){
         break;
       }
       if(file[y]!= undefined){
         if(file[y].includes("Sent from") || file[y].includes("Enviado desde") || file[y].includes("----")){
           break;
         }
       }
     }
      item.Comment =  clean(text);
    }
  }
return item;

}
function clean(text){
  text = text.toLowerCase();
  text = text.replace(/<(?:.|\n)*?>/gm, "");
  text = text.replace("-------------------", "");
  text = text.replace("---------", "");
  text = text.replace("-------", "");
  text = text.replace("-", "");
  text = text.replace("-=20", "");
  text = text.replace("=20", "");
  text = text.replace("&nbsp;", "");
  text = text.replace("=c3=a1", "a");
  text = text.replace("=c3=a9", "e");
  text = text.replace("=c3=ad", "i");
  text = text.replace("=c3=b3", "o");
  //text = text.replace("=c3=b3", "u");
  text = text.replace("=c3=b1", "n");
  text = text.replace("undefined", "");

  return text;
}

main();

