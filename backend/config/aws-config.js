const AWS=require("aws-sdk");
const dotenv=require("dotenv");
dotenv.config();


AWS.config.update({region:"eu-north-1"});
const accessKeyId=process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY

console.log({
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_KEY
})

const s3=new AWS.S3({
    accessKeyId,
    secretAccessKey
});

const S3_BUCKET="commitvaultbucket";

module.exports={s3,S3_BUCKET};