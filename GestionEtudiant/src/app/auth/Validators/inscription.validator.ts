import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmEqual(main: string, confirm: string): ValidatorFn {
  return (ctr: AbstractControl): null | ValidationErrors=> {
    if(!ctr.get(main) && !ctr.get(confirm)){
      return {
        equal: 'nom de champ invalid'
      }
    }
    const principal = ctr.get(main)!.value;
    const confirmation = ctr.get(confirm)!.value;

    return principal === confirmation? null : {
      equal: true
    }
  }
}
