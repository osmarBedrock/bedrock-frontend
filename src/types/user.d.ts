export interface User {
  id:                number;
  firstName:         string;
  lastName:          string;
  avatar:            null;
  email:             string;
  passwordHash:      string;
  googleId:          null;
  emailVerified:     boolean;
  planType:          string;
  stripeCustomerId:  null;
  currentPeriodEnd:  null;
  createdAt:         Date;
  updatedAt:         Date;
  isProfileComplete: boolean;
  enterpriseName:    string;
  enterprisePicture: null;
  verificationData:  VerificationData;
  website:           Website;
}

export interface VerificationData {
  dnsRecord:       string;
  verificationUrl: string;
}

export interface Website {
  id:                 number;
  domain:             string;
  propertyId:         string;
  verificationCode:   string;
  isVerified:         boolean;
  userId:             number;
  googleAccessToken:  string;
  googleRefreshToken: string;
  semrushApiKey:      null;
  createdAt:          Date;
  updatedAt:          Date;
}