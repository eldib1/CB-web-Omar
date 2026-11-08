import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasMinLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumeric && hasMinLength) return null;

    return {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasMinLength,
      },
    };
  };
}

export function passwordMatchValidator(passwordField: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get(passwordField)?.value;
    const confirm = group.get(confirmField)?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  };
}

export function australianPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;
    const auPhoneRegex = /^(\+61|0)[2-9]\d{8}$/;
    return auPhoneRegex.test(value.replace(/\s/g, '')) ? null : { invalidAuPhone: true };
  };
}
