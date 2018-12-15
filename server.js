var express = require('express');
var path = require('path')
var formidable = require('formidable')
// create an express app
var app = express();
var bodyParser = require('body-parser')
var upload = require('express-fileupload')
var fs = require('fs')
var PDF = require('pdfkit')
const hellosign = require('hellosign-sdk')({key:'8fd0684383e64bccebfc9d87bfe4f21ebca6b2d28ecc80094f1efe13d004f394'});
app.use(bodyParser.json())
app.use(upload())

// create an express route for the home page
// http://localhost:8080/
app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname)
    });
});
app.post('/users', function (req, res) {
    console.log('requested...')
    let doc = new PDF();
    let x = 0;
    // var dd;
    let pdfname = 'pdf' + Math.round(Math.random() * 100000)
    console.log(pdfname)
    doc.pipe(fs.createWriteStream(`pdfs/${pdfname}.pdf`))
    if (req.files) {
        let email = req.body.email
        let name = req.body.name
        let description = req.body.description
        let location = req.body.location
        let chosenDate = req.body.date
        let ccInputs = req.body.cc
        if (ccInputs) {
            console.log(JSON.parse(ccInputs))
        }
        var file = req.files.photo
        if (file.length !== 0) {
            doc.image('./images/digi.jpeg', 156, 30, {
                    width: 300,
                    height: 100,
                    align: 'center',
                    valign: 'center'
                })
                .moveDown(5.5)
                .fontSize(24).text('TO:', {
                    underline: false,
                    margin: {
                        left: 20
                    },
                    continued: true
                }).text(name, {
                    underline: true
                })
                .fontSize(24).text('Location:', {
                    underline: false,
                    margin: {
                        left: 20
                    },
                    continued: true
                }).text(location, {
                    underline: true
                }).moveDown(2)
                .fontSize(35)
                .text('Description', {
                    underline: true,
                    margin: {
                        left: 70,
                        right: 70
                    }
                })
                .fontSize(14)
                .text(description, {
                    underline: false
                }).moveDown(2)
                .fontSize(24).text('Dated:', {
                    underline: false,
                    margin: {
                        left: 70
                    },
                    continued: true
                }).text(chosenDate, {
                    underline: true
                }).moveDown(1)
                .fontSize(20)
                .text('Plzz Scroll Down to view site images')
                .addPage()
            file.forEach(function (fila, index) {
                var filename = fila.name
                fila.mv('./images/' + filename, function (err) {

                    if (err) {
                        res.send('error')
                    } else {
                        //      doc.image('images/'+filename,x,y, {fit: [100, 100]})
                        //    .rect(320, 15, 100, 100)
                        //    .stroke()
                        //    .text('Fit', 320, 0)

                        doc.image('./images/' + fila.name, 0, 0, {
                            width: 612,
                            height: 792
                        })
                        if (index < file.length - 1) {
                            doc.addPage()
                        }
                        if (index === file.length - 1) {
                            doc.end()
                            res.json({
                                message: 'Done'
                            })
                        }
                    }
                })
            })

        }
        hellosign.account.get().then((resp) => {
           console.log(resp)
          }).catch((err) => {
        console.log(err)
          });
        //}
        const opts = {
            test_mode: 1,
            title: 'Deal',
            subject: 'Testing Contract',
            message: 'Please Sign the Contract',
            signers: [
              {
                email_address:email,
                name: name
              }
            ],
            cc_email_addresses : JSON.parse(ccInputs),
            files: ['./pdfs/'+pdfname+'.pdf']
          };

          setTimeout(()=>{
            hellosign.signatureRequest.send(opts).then((resp) => {
                console.log(resp)
              }).catch((err) => {
                // handle error
              },500);
          })

    }
})
//start the server on port 8080
app.listen(8080)
// send a message
console.log('Server has started!');