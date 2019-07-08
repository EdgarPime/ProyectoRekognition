const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();
const fs = require('fs');
const express = require("express");
const app = express();
//var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
var s3 = new AWS.S3();

//Creación y configuración de instancia de AWS Rekognition
const rekognition = new AWS.Rekognition({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
  apiVersion: '2016-06-27'
});

app.listen(8000, () => {
  console.log("El servidor está inicializado en el puerto 8000");
 });


app.get('/:nombre', function (req, res) {
  if (req.url != '/favicon.ico'){
  var llave = req.params.nombre;
 /* if (llave= 'favicon.ico') {
      llave = '';
    }*/
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
	let emotionName = '';
	let maxConfidence;
    data.FaceDetails.forEach((response) => {
      maxConfidence = response.Emotions.reduce((a, b) => b.Confidence > a.Confidence ? b : a);
      
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
      
    });
 res.send(` ${emotionName} , ${maxConfidence.Confidence}`);
  

});
}
//Llama al método detectFaces

});