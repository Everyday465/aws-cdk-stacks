import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { ICdkTsApiGatewayStackProps, IValidators } from '../bin/stack-config-types';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiGatewayStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ICdkTsApiGatewayStackProps) {
    super(scope, id, props);

    //Lambda for resolving API request
    const resolver = new lambda.Function(this, 'LambdaResolver', {
      functionName: props.lambda.name,
      description: props.lambda.desc,
      handler: 'index.handler',
      code: new lambda.AssetCode('dist/src'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      memorySize: props.lambda.memory,
      timeout: cdk.Duration.seconds(props.lambda.timeout)
    });

    const integration = new apigateway.LambdaIntegration(resolver);

    //API Gateway RestApi
    const api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: props.api.name,
      description: props.api.desc,
      defaultCorsPreflightOptions:{
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET','POST','PATCH','DELETE']
      },
    });

    //Request validators
    const createValidator = (input: IValidators)=> new apigateway.RequestValidator(
      this, input.requestValidatorName,
      {
        restApi: api,
        requestValidatorName: input.requestValidatorName,
        validateRequestBody: input.validateRequestBody,
        validateRequestParameters: input.validateRequestParameters,
      }
    );

    const bodyValidator = createValidator(props.validators.bodyValidator);
    const paramValidator = createValidator(props.validators.paramValidator);
    const bodyAndParamValidator = createValidator(props.validators.bodyAndParamValidator)

    // API Gateway Model - how the request to app should look like
    const model = new apigateway.Model(this, 'Model', {
      modelName: props.api.modelName,
      restApi: api,
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        required:['name'],
        properties: {
          name: { type: apigateway.JsonSchemaType.STRING },
        }
      }
    });

    //Root Resource /v1
    const rootResource = api.root.addResource(props.api.rootResource);

    //Open Resource and Methods /open
    const openResource = rootResource.addResource('open');

    ['GET','POST','PATCH','DELETE'].map((method)=>{
      openResource.addMethod(method, integration, {
        operationName: `${method} Open Resource`
      })
    });

    //Secure Resources and Mehtods
    const secureResource = rootResource.addResource('secure');
    const paramResource = secureResource.addResource('{param}');

    secureResource.addMethod('GET', integration, {
      operationName: 'Get Secure Resource',
      apiKeyRequired: true,
    });

    //checks if there is body in it, else rejected
    secureResource.addMethod('POST', integration, {
      operationName: 'POST Secure Resource',
      apiKeyRequired: true,
      requestValidator: bodyValidator,
      requestModels: { 'application/json': model },
    });


    //checks if there is param in it, else rejected
    ['GET','DELETE'].map((method)=>{
      paramResource.addMethod(method, integration, {
        operationName: `${method} Secure Param Resource`,
        apiKeyRequired: true,
        requestValidator: paramValidator,
        requestParameters: { 'method.request.path.param': true},
      });
    });

    //checks if there is param&body in it, else rejected
    paramResource.addMethod('PATCH', integration, {
      operationName: 'PATCH Secure Param Resource',
      apiKeyRequired: true,
      requestValidator: bodyAndParamValidator,
      requestParameters: { 'method.request.path.param': true},
      requestModels: { 'application/json': model },
    });

    //API Usageplan - a way to control the api key
    const usageplan = api.addUsagePlan('UsagePlan',{
      name: props.usageplan.name,
      description: props.usageplan.desc,
      apiStages: [{
        api: api,
        stage: api.deploymentStage,
      }], 
      quota: {
        limit: props.usageplan.limit,
        period: apigateway.Period.DAY,
      },
      throttle: {
        rateLimit: props.usageplan.rateLimit,
        burstLimit: props.usageplan.burstLimit,
      },
    });

    //API leu for authorisation
    const apiKey = api.addApiKey('ApiKey',{
      apiKeyName: props.apiKey.name,
      description: props.apiKey.desc,
    })

    usageplan.addApiKey(apiKey);

    

  }
}
