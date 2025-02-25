import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneFieldValidator(controlName1: string, controlName2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const caseLabel = group.get(controlName1)?.value;
    const courtName = group.get(controlName2)?.value;

    if (!caseLabel && !courtName) {
      return { atLeastOne: true };
    }

    return null;
  };
}
