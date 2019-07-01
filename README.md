###### SMS_with_SNS


## Implement a lambda function with Nodejs
To let a lambda fuction use a node package like for instance `moment` then you need to install that node package locally.
`npm install moment`. This should install that package in a folder called "node_modules" in the same folder as where you 
executed the install command.

For me it instead installed in "node_modules" for the root project. To solve this, just create a file called "node_modules"
and copy the correct package there.    

Creating deployment package: `https://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html`


##upload lambda
To upload the lambda function you must first zip the files and node modules and then upload that zip file.


## zip

`zip -r calculateDates.zip .
`

##create/update a lambda function

`aws lambda update-function-code --function-name CalculateDates --zip-file fileb://calculateDates.zip  --region us-east-1 --profile fredrikDeveloper
`


##Create a Cloud Formation Template 

###A template for a lambda function
When having a lambda function which i zipped, just use `S3Bucket` and `S3Key` to point to where your lambda function is located.

```
MyLambdaFunction:
     Type: "AWS::Lambda::Function"
     Properties:
       Handler: "index.calculateDates"
       Role: !GetAtt [ LambdaExecutionRole, Arn ]
       Code:
         S3Bucket: "fredrik-sms-service"
         S3Key: "calculateDates.zip"
 #        S3ObjectVersion: String
 #        ZipFile: String               
       Runtime: "nodejs10.x"
       Timeout: "25"
```
       
       
`Zipfile` : The source code of your Lambda function. If you include your function source inline with this parameter, AWS CloudFormation places it in a file named index and zips it to create a deployment package.      


###upload a .zip to S3
```
 aws s3 cp ./iterator.zip s3://fredrik-sms-service/ --region us-east-1 --profile fredrikDeveloper
```