var fs = require('fs')
var PDF= require('pdfkit')
let doc = new PDF();

// doc.pipe(fs.createWriteStream(`pdfs/${req.body.bioFileName}.pdf`))
var x=270;
var y=5;
const makePDF= function(fileObj,filename){

    doc.pipe(fs.createWriteStream(`pdfs/${filename}.pdf`))
    doc.image('./images/'+fileObj.name,x+50,y+10, {fit: [100, 100]})
            .rect(320, 15, 100, 100)
            .stroke()
            .text('Fit', 320, 0)
             doc.end()
           
}
module.exports.makePDF=makePDF;