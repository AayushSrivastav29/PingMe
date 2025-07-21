const AWS = require('aws-sdk');
const { Sequelize, DataTypes } = require('sequelize');


const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
});

exports.uploadFile = (file) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${DataTypes.UUIDV4}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  return s3.upload(params).promise();
};
