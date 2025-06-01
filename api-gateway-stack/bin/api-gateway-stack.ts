#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStackStack } from '../lib/api-gateway-stack-stack';
import environmentConfig from './stack-config';

const app = new cdk.App();
new ApiGatewayStackStack(app, 'ApiGatewayStackStack', environmentConfig);