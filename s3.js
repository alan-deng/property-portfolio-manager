require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_BUCKET_REGION;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  bucketName,
  region,
});

// Upload function
const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
};

exports.uploadFile = uploadFile;

//Delete function

const deleteFile = (key) => {
  const deleteParams = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };
  return s3
    .deleteObject(deleteParams, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    })
    .promise();
};

exports.deleteFile = deleteFile;
