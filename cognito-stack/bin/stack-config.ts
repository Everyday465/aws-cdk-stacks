import { ICdkTsCognitoStackProps } from './stack-config-types';

const environmentConfig: ICdkTsCognitoStackProps = {
  imports: {
    bucketArn: 'myBucketArn',
    tableArn: 'myTableArn',
    kmsKeyArn: 'myKmsArn',
    //     googleSecretName: 'myGoogleClientSecret',
    //     facebookSecretName: 'myFacebookClientSecret',
    //     acmArn: 'usEast1Certificate',
    //     hostedZoneId: 'myRoute53HostedZondeId',
  },
  //   domain: 'main.d14gv3013y1eiy.amplifyapp.com/',
  //   cognitoDomain: 'auth.main.d14gv3013y1eiy.amplifyapp.com/',
  postSignupLambdaName: 'post-signup-trigger',
  userPoolName: 'userpool',
  identityPoolName: 'identitypool',
  userPoolClientName: 'userpool-client',
  authenticatedUserName: 'auth-role',
  unAuthenticatedUserName: 'unauth-role',
  email: {
    subject: 'Account Verification',
    body: `Welcome to domain!
Click on the link to verify your email {##Verify Email##}`,
    // from: 'example@domain.com',
    // name: 'domain',
    // replyTo: 'support@domain.com',
  },
  callbackUrls: [
    'https://main.d14gv3013y1eiy.amplifyapp.com/',
    // 'https://domain.com/design',
    // 'https://domain.com/checkout',
  ],
  logoutUrls: [
    'https://main.d14gv3013y1eiy.amplifyapp.com/',
    // 'https://domain.com/design',
    // 'https://domain.com/checkout',
    // 'https://domain.com/login',
  ],
  redirectUri: 'https://main.d14gv3013y1eiy.amplifyapp.com/',
};

export default environmentConfig;