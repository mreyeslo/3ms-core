
import { ObjectUtils } from './object-utils';
import { DateUtils } from './date-utils';
import { RegexUtils } from './regex-utils';
import { FormField } from '../models/form/form-field';
import { FormLayout } from '../models/form/form-layout';
import { FormFieldType } from '../models/form/form-field-type';
import { AbstractControl, ValidatorFn, Validators } from 'react-reactive-form';

export class FormUtils {
   
    static getFormValues<T>(formLayout: FormLayout): T {
        const filters = formLayout.Form.getRawValue();
        // remove unused or empty fields
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value !== null && value !== undefined) {
                const formField = formLayout.FormFields.find(field => field.Id === key);
                if (!formField) {
                    return;
                }
                // if text input is empty remove
                if (formField.Type === FormFieldType.Text && filters[key].length === 0) {
                    delete filters[key];
                }
                else if (formField.Type === FormFieldType.Text && filters[key].length > 0) {
                    filters[key] = filters[key].toString().trim();
                }
                
                else if (formField.Type === FormFieldType.TextMasked) {
                    const stringValue = filters[key].toString()
                    if (stringValue.length === 0) {
                        delete filters[key];
                    }
                    if (stringValue.length > 0 && formField.RemoveMaskCharacter) {
                        filters[key] = stringValue.replace(formField.RemoveMaskCharacter, '');
                    }
                }
                else if (formField.Type === FormFieldType.Select) {
                    filters[key] = filters[key] ? formField.OptionValue ? filters[key][formField.OptionValue] : (filters[key].Value ? filters[key].Value : filters[key]) : null;
                } else if (formField.Type === FormFieldType.Radio) {
                    filters[key] = filters[key];
                } else if (formField.Type === FormFieldType.Checkbox) {
                    filters[key] = filters[key][0];
                } else if (formField.Type === FormFieldType.Date) {
                    filters[key] = filters[key];
                } else if (formField.Type === FormFieldType.SelectTable) {
                    filters[key] = filters[key] && formField.OptionValue ? formField.Value[formField.OptionValue] : null;
                } else if (formField.Type === FormFieldType.Json) {
                    filters[key] = filters[key] ? JSON.stringify(filters[key]) : null;
                }
                if (formField.DoNotSubmit) {
                    delete filters[key];
                }
            } else {
                delete filters[key];
            }

        });
        const formValues = filters as T;

        return formValues;
    }
    static getValidators(configuration: FormField): Array<ValidatorFn> {
        const validators = new Array<ValidatorFn>();


        if (configuration.RequiredTrue) {
            validators.push(Validators.requiredTrue);
        }
        if (configuration.MaxLength) {
            validators.push(Validators.maxLength(configuration.MaxLength));
        }
        if (configuration.MaxDate) {
            validators.push(this.MaxDateValidator(configuration.MaxDate));
            configuration.PatternErrorMessage = 'Maximum Date not valid.' + configuration.MaxDate.toLocaleDateString();
        }
        if (configuration.MinDate) {
            validators.push(this.MinDateValidator(configuration.MinDate));
            configuration.PatternErrorMessage = 'Minimum Date not valid. ' + configuration.MinDate.toLocaleDateString();
        }

        if (configuration.MinLength) {
            validators.push(Validators.minLength(configuration.MinLength));
        }

        if (configuration.MinNumber !== undefined && configuration.MinNumber !== null) {
            validators.push(Validators.min(configuration.MinNumber));
        }

        if (configuration.MaxNumber !== undefined && configuration.MaxNumber !== null) {
            validators.push(Validators.max(configuration.MaxNumber));
        }
        if (configuration.Pattern) {
            validators.push(Validators.pattern(configuration.Pattern));
        }
        if (configuration.IsEmail) {
            validators.push(Validators.pattern(RegexUtils.emailRegex));
            configuration.PatternErrorMessage = 'Email must be a in valid format.';
        }
        if (configuration.Type === FormFieldType.Select) {
            validators.push(this.SelectValidator());
        }
        if (configuration.Type === FormFieldType.Select) {
            validators.push(this.SelectValidatorActive());
            configuration.PatternErrorMessage = 'Selection not allowed.';
        }
        if (configuration.Type === FormFieldType.SelectTable) {
            validators.push(this.SelectValidator());
        }

        if (configuration.Required) {
            validators.push(Validators.required);
        }
        return validators;
    }
    static SelectValidator() {      //factory function

        return (control: AbstractControl): { [key: string]: boolean } | null => {

            if (control.value !== null && control.value.Value === null) {
                return { 'selectValidator': true }
            }
            return null;
        };
    }

    static SelectValidatorActive() {      //factory function

        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if(control.value === null){
                return null;
            }
            else if (control.value !== null && control.value.inactive) {
                return { 'selectValidator': true }
            }
            return null;
        };
    }

    static MinDateValidator(date: Date) {      //factory function

        return (control: AbstractControl): { [key: string]: boolean } | null => {

            if (control.value !== null && control.value < date) {
                return { 'minDateValidator': true }
            }
            return null;
        };
    }

    static MaxDateValidator(date: Date) {      //factory function

        return (control: AbstractControl): { [key: string]: boolean } | null => {

            if (control.value !== null && control.value > date) {
                return { 'maxDateValidator': true }
            }
            return null;
        };
    }

}
