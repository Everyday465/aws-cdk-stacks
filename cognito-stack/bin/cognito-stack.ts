#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito-stack';
import environmentConfig from './stack-config';

const app = new cdk.App();
new CognitoStack(app, 'CognitoStack', environmentConfig);