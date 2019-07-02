https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-lambda.html

#Step Functions and AWS SAM CLI Local

## Set up AWS 
1. Install AWS SAM CLI
    1. Initialize application
   ```
   >sam local init ... 
   ```
2. Test the application locally.
    ```
    >sam local start-api
    >curl http`://127.0.0.1:3000/hello
    ```    
3. Start AWS SAM CLI Local  
    ```
    >sam local start-lambda
    2019-07-02 13:43:35 Starting the Local Lambda Service. You can now invoke your Lambda Functions defined in your template through the endpoint.
    2019-07-02 13:43:35  * Running on http://127.0.0.1:3001/ (Press CTRL+C to quit)
    ```    
4.  Run stepfunctions container
    ```
    aws-stepfunctions-local-credentials.txt
    
    AWS_DEFAULT_REGION=us-east-1
    AWS_ACCESS_KEY_ID=*****
    AWS_SECRET_ACCESS_KEY=*****
    #WAIT_TIME_SCALE=VALUE
    LAMBDA_ENDPOINT=http://127.0.0.1:3001/    <-----Make sure this is set to the lambda endpoint, not the APIGW endpoint
    BATCH_ENDPOINT=VALUE
    DYNAMODB_ENDPOINT=VALUE
    ECS_ENDPOINT=VALUE
    GLUE_ENDPOINT=VALUE
    SAGE_MAKER_ENDPOINT=VALUE
    SQS_ENDPOINT=VALUE
    SNS_ENDPOINT=VALUE

    
    >docker run -p 8083:8083 --env-file ~/.aws/aws-stepfunctions-local-credentials.txt amazon/aws-stepfunctions-local
    
    
    Step Functions Local
    Version: 1.2.0
    Build: 2019-06-05
    2019-07-02 11:50:22.616: Configure [AWS_DEFAULT_REGION] to [us-east-1]
    2019-07-02 11:50:22.618: Configure [LAMBDA_ENDPOINT] to [http://127.0.0.1:3001/]
    2019-07-02 11:50:22.618: Configure [BATCH_ENDPOINT] to [VALUE]
    2019-07-02 11:50:22.618: Configure [DYNAMODB_ENDPOINT] to [VALUE]
    2019-07-02 11:50:22.619: Configure [ECS_ENDPOINT] to [VALUE]
    2019-07-02 11:50:22.619: Configure [GLUE_ENDPOINT] to [VALUE]
    2019-07-02 11:50:22.619: Configure [SQS_ENDPOINT] to [VALUE]
    2019-07-02 11:50:22.620: Configure [SNS_ENDPOINT] to [VALUE]
    2019-07-02 11:50:22.637: Loaded credentials from environment
    2019-07-02 11:50:22.637: Starting server on port 8083 with account 123456789012, region us-east-1
    ``` 

5.  Create a State Machine That References Your AWS SAM CLI Local Function
    ```
    aws stepfunctions --endpoint http://localhost:8083 create-state-machine --definition "{\
      \"Comment\": \"A Hello World example of the Amazon States Language using an AWS Lambda Local function\",\
      \"StartAt\": \"HelloWorld\",\
      \"States\": {\
        \"HelloWorld\": {\
          \"Type\": \"Task\",\
          \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:HelloWorldFunction\",\
          \"End\": true\
        }\
      }\
    }\
    }}" --name "HelloWorld" --role-arn "arn:aws:iam::012345678901:role/DummyRole"
    ```
6. Start an execution of Your Local State Machine   
```
aws stepfunctions --endpoint http://localhost:8083 start-execution --state-machine arn:aws:states:us-east-1:123456789012:stateMachine:HelloWorld --name test
aws stepfunctions --endpoint http://localhost:8083 describe-execution --execution-arn arn:aws:states:us-east-1:123456789012:execution:HelloWorld:test

{
    "status": "FAILED", 
    "startDate": 1562068809.938, 
    "name": "test", 
    "executionArn": "arn:aws:states:us-east-1:123456789012:execution:HelloWorld:test", 
    "stateMachineArn": "arn:aws:states:us-east-1:123456789012:stateMachine:HelloWorld", 
    "stopDate": 1562068810.549, 
    "input": "{}"
}

```
