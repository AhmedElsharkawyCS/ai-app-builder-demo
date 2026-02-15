export interface BusinessDetails {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  website: string;
  industry: string;
  description: string;
  annualRevenue: string;
  employeeCount: string;
}

export interface OwnerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  ssn: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'verified' | 'rejected';
  progress: number;
  category: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  swiftCode: string;
}

export interface FormState {
  business: BusinessDetails;
  owner: OwnerDetails;
  documents: UploadedDocument[];
  bank: BankDetails;
  agreedToTerms: boolean;
}

export const STEPS = [
  'Business Details',
  'Owner Verification',
  'Document Upload',
  'Bank Account',
  'Review & Submit',
] as const;
