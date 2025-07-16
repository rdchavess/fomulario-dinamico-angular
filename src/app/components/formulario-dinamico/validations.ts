import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function validatorsCompose(validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allErrors = validators
      .map(fn => fn(control))
      .filter(e => e !== null);

    if (allErrors.length === 0) {
      return null;
    }

    return allErrors.reduce((acc, err) => ({ ...acc, ...err }), {});
  };
}


// Validação de data mínima
export function minDateValidator(minDateStr: string): ValidatorFn {
  return (control: AbstractControl) => {
    const inputDate = new Date(control.value);
    const minDate = new Date(minDateStr);
    if (control.value && inputDate < minDate) {
      return { minDate: true };
    }
    return null;
  };
}

// Validação de data máxima
export function maxDateValidator(maxDateStr: string): ValidatorFn {
  return (control: AbstractControl) => {
    const inputDate = new Date(control.value);
    const maxDate = new Date(maxDateStr);
    if (control.value && inputDate > maxDate) {
      return { maxDate: true };
    }
    return null;
  };
}

export function dataRangeValidator(dataInicioNome: string, dataFimNome: string): ValidatorFn {
  return (group: AbstractControl) => {
    const inicio = group.get(dataInicioNome)?.value;
    const fim = group.get(dataFimNome)?.value;

    if (inicio && fim && new Date(inicio) > new Date(fim)) {
      return { dataInvalida: true };
    }
    return null;
  };
}
