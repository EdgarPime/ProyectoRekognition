const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();
const fs = require('fs');
const express = require("express");
const app = express();
//var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

//Creación y configuración de instancia de AWS Rekognition
const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: '2016-06-27'
});



//var urlParams = {Bucket: 'almacenimagenes', Key: 'test.jpg'};
//s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
//  console.log('the url of the image is', url);
//})


//Lee la imagen, la convierte a Buffer y prepara el objeto
//const file_name = params.key;
//const bitmap = 'https://almacenimagenes.s3.us-east-2.amazonaws.com/test.jpg' // fs.readFileSync(`almacenimagenes.s3.us-east-2.amazonaws.com/${file_name}`);
//let image = {
 // Image: {
  //  Bytes: new Buffer(bitmap)
  //},
  //Attributes: ['ALL']
//}
app.listen(8000, () => {
  console.log("El servidor está inicializado en el puerto 8000");
 });




app.get('/:nombre', function (req, res) {
  var llave = req.params.nombre;
  let image = {
    Image: {
       S3Object: {
       Bucket: "bucketproyecto", 
       Name: llave
      }
     },
     Attributes: ['ALL']
    };
  rekognition.detectFaces(image, (error, data) => {
    if (error) {
      throw new Error(error);
    }
    data.FaceDetails.forEach((response) => {
      let maxConfidence = response.Emotions.reduce((a, b) => b.Confidence > a.Confidence ? b : a);
      let emotionName = '';
      switch (maxConfidence.Type) {
        case 'HAPPY':
          emotionName = 'ALEGRÍA';
        break;
  
        case 'SAD':
          emotionName = 'PENA';
        break;
        
        case 'ANGRY':
          emotionName = 'ENOJO';
        break;
        
        case 'CONFUSED':
          emotionName = 'CONFUSIÓN';
        break;
        
        case 'DISGUSTED':
          emotionName = 'DISGUSTO';
        break;
        
        case 'SURPRISED':
          emotionName = 'SORPRESA';
        break;
        
        case 'CALM':
          emotionName = 'CALMA';
        break;
  
        case 'UNKNOWN':
          emotionName = 'DESCONOCIDA';
        break;
  
        default:
          emotionName = 'DESCONOCIDA';
        break;
      }
      res.send(` ${emotionName} , ${maxConfidence.Confidence}`);
    });
 
	

});
//Llama al método detectFaces

});
//correlo