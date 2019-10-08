# SMS_with_SNS
Nice blog that shows the process:
https://itnext.io/creating-aws-lambda-applications-with-sam-dd13258c16dd

SAM local with StepFuctions:
https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-lambda.html

These instructions are intended to help create an api that starts a state machine which sends three text messages to a receiver before a certain date.

The AWS services involved to do this: APIGW, Lambda Step Functions, Lambda functions, Clod Formation and SAM (Serverless Application Model).   


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


##Step Functions and AWS SAM CLI Local
With both Step Functions and Lambda running on your local machine, you can test your state machine and Lambda functions without deploying your code to AWS.

`https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-lambda.html`
`https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-docker.html`
`https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-config-options.html`

To get docker image
`docker pull amazon/aws-stepfunctions-local
`

To configure Step Functions Local for Docker, create a file: `aws-stepfunctions-local-credentials.txt.



To start downloaded version of Step Functions
`docker run -p 8083:8083 amazon/aws-stepfunctions-local
`

## Getting started with SAM
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-quick-start.html

### Install SAM CLI
Here you se the process of installing the cli:
`https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html`


#### 1. install docker
```
https://docs.docker.com/docker-for-mac/install/
```
If you already have docker for Mac you can move on to configure shared drives.

#### 2. configure shared drives
The AWS SAM CLI requires that the project directory, or any parent directory, is listed in a shared drive. To share drives on macOS, see File sharing.

For instance it is enough that `/Users` if your project folder is /Users/fredrik/git/SMS_with_SNS/sam-sms` 

#### 3. install cli

`>pip install --user aws-sam-cli`

You also need to update the path to where scripts are installed by pyton. 
```
>vi .bash_profile
USER_BASE_PATH=$(python -m site --user-base)
export PATH=$PATH:$USER_BASE_PATH/bin
```

### 1. Initialize a SAM project
 Initialize a serverless application with a SAM template, folder structure for your Lambda functions, connected to an 
 event source such as APIs, S3 Buckets or DynamoDB Tables. This application includes everything you need to get started with serverless and eventually grow into a production scale application.
      
`sam init --runtime nodejs8.10 --name sam-sms`

### 2.Test Locally 
Test the application locally using sam local invoke and/or sam local start-api. Note that with these commands, even though your Lambda function is invoked locally, it reads from and writes to AWS resources in the AWS Cloud.
 
API Gateway locally invokes the Lambda function that the endpoint is mapped to. The Lambda function executes in the local Docker container and returns hello world. API Gateway returns a response to the browser that contains the text. 
 
If you change your lambda code the code will be reloaded dynamically, without your having restart the sam local process.


* Intellij asked me to install npm dependecies for this sam-sms project. After I did this I could run:
```
>curl http`://127.0.0.1:3000/hello
 {"message":"hello world","location":"81.170.220.10"} 
 ```
 
* Before installing dependencies I got:
 ```
 Unable to import module 'app': Error
```


 
```
>sam local start-api
2019-07-02 10:29:27 Found credentials in shared credentials file: ~/.aws/credentials
2019-07-02 10:29:27 Mounting HelloWorldFunction at http://127.0.0.1:3000/hello [GET]
2019-07-02 10:29:27 You can now browse to the above endpoints to invoke your functions. You do not need to restart/reload SAM CLI while working on your functions changes will be reflected instantly/automatically. You only need to restart SAM CLI if you update your AWS SAM template
2019-07-02 10:29:27  * Running on http://127.0.0.1:3000/ (Press CTRL+C to quit)
2019-07-02 10:29:27 Invoking app.lambdaHandler (nodejs8.10)

Fetching lambci/lambda:nodejs8.10 Docker container image................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
2019-07-02 10:30:31 Mounting /Users/fredrik/git/SMS_with_SNS/sam-sms/hello-world as /var/task:ro inside runtime container
START RequestId: 851b3135-0e28-1403-5c2b-8b07c26a1233 Version: $LATEST

```
 

```
>sam local start-lambda
2019-07-02 14:43:58 Starting the Local Lambda Service. You can now invoke your Lambda Functions defined in your template through the endpoint.
2019-07-02 14:43:58  * Running on http://127.0.0.1:3001/ (Press CTRL+C to quit)


>sam local invoke "IteratorFunction"  -e iterator/event.json 
2019-07-02 15:02:12 Found credentials in shared credentials file: ~/.aws/credentials
2019-07-02 15:02:13 Invoking index.iterator (nodejs8.10)

Fetching lambci/lambda:nodejs8.10 Docker container image......
2019-07-02 15:02:14 Mounting /Users/fredrik/git/SMS_with_SNS/sam-sms-service/iterator as /var/task:ro inside runtime container
START RequestId: 60660931-e0cc-13c0-2c3b-0b2515a7a662 Version: $LATEST
2019-07-02T13:02:18.517Z        60660931-e0cc-13c0-2c3b-0b2515a7a662    { Comment: 'Test my Iterator function',
  iterator: { count: 3, index: 0, step: 1, nextDate: '2019-07-01T08:36:00Z' },
  dates: 
   [ '2019-07-01T13:09:44.201Z',
     '2019-07-01T13:10:22.100Z',
     '2019-07-01T13:11:00.000Z' ] }
END RequestId: 60660931-e0cc-13c0-2c3b-0b2515a7a662
REPORT RequestId: 60660931-e0cc-13c0-2c3b-0b2515a7a662  Duration: 10.78 ms      Billed Duration: 100 ms Memory Size: 128 MB     Max Memory Used: 31 MB  

{"index":1,"step":1,"count":3,"nextDate":"2019-07-01T13:09:44.201Z","continue":true}
```


iterator/event.json
```
{
  "Comment": "Test my Iterator function",
  "iterator": {
    "count": 3,
    "index": 0,
    "step": 1,
    "nextDate": "2019-07-01T08:36:00Z"	
  },
  "dates": [
    "2019-07-01T13:09:44.201Z",
    "2019-07-01T13:10:22.100Z",
    "2019-07-01T13:11:00.000Z"
  ]
}

```


### 3.Package 
When you're satisfied with your Lambda function, bundle the Lambda function, AWS SAM template, and any dependencies into an AWS CloudFormation deployment package using sam package.



``` 
>sam package \
         --output-template-file packaged.yaml \
         --s3-bucket fredrik-sms-service --profile fredrikDeveloper2 --region us-east-1
```


### 4.Deploy
Deploy the application to the AWS Cloud using sam deploy. At this point, you're able to test your application in the AWS Cloud by invoking it using standard Lambda methods.

````
aws cloudformation deploy --template-file /Users/fredrik/git/SMS_with_SNS/sam-sms/packaged.yaml --stack-name hello1  --capabilities CAPABILITY_IAM --region us-east-1 --profile fredrikDeveloper

Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - hello1

````

#SAM Local  

## Invoking Functions Locally
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html

You can invoke your function locally by using the sam local invoke command and providing its function logical ID and an event file. Alternatively, sam local invoke also accepts stdin as an event.

```
>sam local invoke "HelloWorldFunction"  --no-event 
2019-07-02 12:37:56 Found credentials in shared credentials file: ~/.aws/credentials
2019-07-02 12:37:56 Invoking app.lambdaHandler (nodejs8.10)

Fetching lambci/lambda:nodejs8.10 Docker container image......
2019-07-02 12:37:58 Mounting /Users/fredrik/git/SMS_with_SNS/sam-sms/hello-world as /var/task:ro inside runtime container
START RequestId: c18714b8-f3ad-1c2e-ffb5-a6972744222e Version: $LATEST
END RequestId: c18714b8-f3ad-1c2e-ffb5-a6972744222e
REPORT RequestId: c18714b8-f3ad-1c2e-ffb5-a6972744222e  Duration: 449.99 ms     Billed Duration: 500 ms Memory Size: 128 MB     Max Memory Used: 33 MB  

```

## local start-api
Use the sam local start-api command to start a local instance of **API Gateway** that you will use to test HTTP request/response functionality. This functionality features hot reloading to enable you to quickly develop and iterate over your functions.


Allows you to run your serverless application locally for quick development and testing. When you run this command in a directory that contains your serverless functions and your AWS SAM template, it creates a local HTTP server that hosts all of your functions.

When it's accessed (through a browser, CLI, and so on), it starts a Docker container locally to invoke the function. It reads the CodeUri property of the AWS::Serverless::Function resource to find the path in your file system that contains the Lambda function code. This could be the project's root directory for interpreted languages like Node.js and Python, or a build directory that stores your compiled artifacts or a Java Archive (JAR) file.

If you're using an interpreted language, local changes are available immediately in the Docker container on every invoke. For more compiled languages or projects that require complex packing support, we recommend that you run your own building solution, and point AWS SAM to the directory or file that contains the build artifacts.

Usage:

sam local start-api [OPTIONS]



## local start-lambda
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-start-lambda.html

Enables you to programmatically invoke your Lambda function locally by using the AWS CLI or SDKs. This command starts a local endpoint that emulates AWS Lambda. You can run your automated tests against this local Lambda endpoint. When you send an invoke to this endpoint using the AWS CLI or SDK, it locally executes the Lambda function that's specified in the request.


Usage:

`sam local start-lambda [OPTIONS]
Examples:

### SETUP CLI
Start the local Lambda endpoint by running this command in the directory that contains your AWS SAM template.
$ sam local start-lambda

### USING AWS CLI
Then, you can invoke your Lambda function locally using the AWS CLI
$ aws lambda invoke --function-name "HelloWorldFunction" --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl out.txt


### USING AWS SDK
You can also use the AWS SDK in your automated tests to invoke your functions programatically.
Here is a Python example:
    self.lambda_client = boto3.client('lambda',
                                  endpoint_url="http://127.0.0.1:3001",
                                  use_ssl=False,
                                  verify=False,
                                  config=Config(signature_version=UNSIGNED,
                                                read_timeout=0,
                                                retries={'max_attempts': 0}))
    self.lambda_client.invoke(FunctionName="HelloWorldFunction")


## sam local invoke
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-invoke.html
   Invokes a local Lambda function once and quits after invocation completes.
   
   This is useful for developing serverless functions that handle asynchronous events (such as Amazon S3 or Amazon Kinesis events). It can also be useful if you want to compose a script of test cases. The event body can be passed in either by stdin (default), or by using the --event parameter. The runtime output (logs etc) is output to stderr, and the Lambda function result is output to stdout.
   
   Usage:
   ```
   sam local invoke [OPTIONS] [FUNCTION_IDENTIFIER]
   ```
  
  
## debugging lambda locally
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-debugging.html

```
# Invoke a function locally in debug mode on port 5858
$ sam local invoke -d 5858 <function logical id>

# Start local API Gateway in debug mode on port 5858
$ sam local start-api -d 5858

Note

If you're using sam local start-api, the local API Gateway instance exposes all of your Lambda functions. However, because you can specify a single debug port, you can only debug one function at a time. You need to call your API before the AWS SAM CLI binds to the port, which allows the debugger to connect.

```

You need the AWS toolkit for JetBrains. Install the plugin `AWS Toolkit`. Requires IntelliJ. 18.3 or later. You will also need `AWS CLI`, `Docker` and `SAM CLI`, see links below.

https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html
https://aws.amazon.com/intellij/
https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/setup-toolkit.html

You can use the AWS Toolkit for JetBrains to:

* Create, deploy, change, and delete AWS serverless applications in an AWS account.
* Create, run (invoke) and debug locally, run (invoke) remotely, change, and delete AWS Lambda functions in an AWS account.
* View event logs for and delete AWS CloudFormation stacks in an AWS account.
* Switch to using different AWS credentials to connect with a different set of access permissions within the same AWS account or a different one.
* Switch to working with AWS resources in a different AWS Region for the connected AWS account.
* Use an HTTP proxy and update it as needed.


**Note**
The AWS Toolkit for JetBrains includes the AWS Toolkit for IntelliJ (for Java development), and the AWS Toolkit for PyCharm (for Python development).

A test...