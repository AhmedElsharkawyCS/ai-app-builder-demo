import React, { createContext, useContext, useState, useCallback } from 'react';
import type { FormState } from '../types';

const initialState: FormState = {
  business: {
    businessName: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    website: '',
    industry: '',
    description: '',
    annualRevenue: '',
    employeeCount: '',
  },
  owner: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    ssn: '',
  },
  documents: [],
  bank: {
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: '',
    swiftCode: '',
  },
  agreedToTerms: false,
};

interface FormContextType {
  formState: FormState;
  updateBusiness: (data: Partial<FormState['business']>) => void;
  updateOwner: (data: Partial<FormState['owner']>) => void;
  addDocument: (doc: FormState['documents'][0]) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, data: Partial<FormState['documents'][0]>) => void;
  updateBank: (data: Partial<FormState['bank']>) => void;
  setAgreedToTerms: (val: boolean) => void;
}

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<FormState>(initialState);

  const updateBusiness = useCallback((data: Partial<FormState['business']>) => {
    setFormState((prev) => ({ ...prev, business: { ...prev.business, ...data } }));
  }, []);

  const updateOwner = useCallback((data: Partial<FormState['owner']>) => {
    setFormState((prev) => ({ ...prev, owner: { ...prev.owner, ...data } }));
  }, []);

  const addDocument = useCallback((doc: FormState['documents'][0]) => {
    setFormState((prev) => ({ ...prev, documents: [...prev.documents, doc] }));
  }, []);

  const removeDocument = useCallback((id: string) => {
    setFormState((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
  }, []);

  const updateDocument = useCallback((id: string, data: Partial<FormState['documents'][0]>) => {
    setFormState((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }));
  }, []);

  const updateBank = useCallback((data: Partial<FormState['bank']>) => {
    setFormState((prev) => ({ ...prev, bank: { ...prev.bank, ...data } }));
  }, []);

  const setAgreedToTerms = useCallback((val: boolean) => {
    setFormState((prev) => ({ ...prev, agreedToTerms: val }));
  }, []);

  return (
    <FormContext.Provider
      value={{
        formState,
        updateBusiness,
        updateOwner,
        addDocument,
        removeDocument,
        updateDocument,
        updateBank,
        setAgreedToTerms,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
}
