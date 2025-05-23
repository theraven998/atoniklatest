import { useCallback, useState } from 'react';
import cardValidator from 'card-validator';

export type CreditCardIssuer =
  | 'visa'
  | 'mastercard'
  | 'american-express'
  | 'diners-club'
  | 'discover'
  | 'jcb';

export type CreditCardFormField = 'name' | 'number' | 'expiry' | 'cvc';

export type CreditCardFormValues = {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
  type?: CreditCardIssuer;
};

export type ValidationState = 'incomplete' | 'invalid' | 'valid';

export type CreditCardFormState = {
  name: ValidationState;
  number: ValidationState;
  expiry: ValidationState;
  cvc: ValidationState;
};

export type CreditCardFormData = {
  valid: boolean;
  values: CreditCardFormValues;
  status: CreditCardFormState;
};

const toStatus = (validation: {
  isValid: boolean;
  isPotentiallyValid: boolean;
}): ValidationState => {
  return validation.isValid
    ? 'valid'
    : validation.isPotentiallyValid
    ? 'incomplete'
    : 'invalid';
};

const removeNonNumber = (string = ''): string => string.replace(/[^\d]/g, '');

const limitLength = (string = '', maxLength: number): string =>
  string.slice(0, maxLength);

const addGaps = (string = '', gaps: number[]): string => {
  const offsets = [0, ...gaps, string.length];
  return offsets
    .map((end, index) => {
      if (index === 0) return '';
      const start = offsets[index - 1] || 0;
      return string.slice(start, end);
    })
    .filter(part => part !== '')
    .join(' ');
};

const formatCardNumber = (
  number: string,
  maxLength: number,
  gaps: number[]
): string => {
  const numberSanitized = removeNonNumber(number);
  const lengthSanitized = limitLength(numberSanitized, maxLength);
  return addGaps(lengthSanitized, gaps);
};

const formatCardExpiry = (expiry: string): string => {
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) {
    return `0${sanitized}`;
  }
  if (sanitized.length > 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2)}`;
  }
  return sanitized;
};

const formatCardCVC = (cvc: string, cvcMaxLength: number): string => {
  return limitLength(removeNonNumber(cvc), cvcMaxLength);
};

export const useCreditCardForm = (
  onChange: (formData: CreditCardFormData) => void
) => {
  const [formState, setFormState] = useState<CreditCardFormState>({
    name: 'incomplete',
    number: 'incomplete',
    expiry: 'incomplete',
    cvc: 'incomplete',
  });

  const [values, setValues] = useState<CreditCardFormValues>({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    type: undefined,
  });

  const onChangeValue = useCallback(
    (field: CreditCardFormField, value: string) => {
      const newValues = {
        ...values,
        [field]: value,
      };

      const numberValidation = cardValidator.number(newValues.number);

      const cvcMaxLength = numberValidation.card?.code.size || 3;
      const cardNumberGaps = numberValidation.card?.gaps || [4, 8, 12];
      const cardNumberMaxLength = Math.max(...(numberValidation.card?.lengths || [16]));

      const newFormattedValues: CreditCardFormValues = {
        name: newValues.name,
        number: formatCardNumber(newValues.number, cardNumberMaxLength, cardNumberGaps),
        expiry: formatCardExpiry(newValues.expiry),
        cvc: formatCardCVC(newValues.cvc, cvcMaxLength),
        type: numberValidation.card?.type as CreditCardIssuer,
      };

      const newFormState: CreditCardFormState = {
        name: newFormattedValues.name.trim().length > 0 ? 'valid' : 'incomplete',
        number: toStatus(cardValidator.number(newFormattedValues.number)),
        expiry: toStatus(cardValidator.expirationDate(newFormattedValues.expiry)),
        cvc: toStatus(cardValidator.cvv(newFormattedValues.cvc, cvcMaxLength)),
      };

      setValues(newFormattedValues);
      setFormState(newFormState);

      onChange({
        valid:
          newFormState.name === 'valid' &&
          newFormState.number === 'valid' &&
          newFormState.expiry === 'valid' &&
          newFormState.cvc === 'valid',
        values: newFormattedValues,
        status: newFormState,
      });
    },
    [values, onChange]
  );

  return {
    values,
    status: formState,
    onChangeValue,
  };
};
