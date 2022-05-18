
import { Component } from "react";
import { FormControl, FormGroup, Observable } from "react-reactive-form";
import { FormField } from "../models/form/form-field";
import { FormFieldType } from "../models/form/form-field-type";
import { FormLayout } from "../models/form/form-layout";
import { DateUtils } from "../utils/date-utils";
import { FormUtils } from "../utils/form-utils";

export class FormService extends Component {
    static myInstance: any = null;

    static getInstance(props: any) {
        return new FormService(props);
    }
    initializeForm(formLayout: FormLayout, source?: any, loadOptions = true, disableAll = false): void {

        const fieldsToDisplay = new Set<string>();
        // get last questions response
        let lastDynamicFieldValue;
        // let fieldsToDisplay = new Array<string>();
        formLayout.Form = new FormGroup({});

        const firstDynamicFieldIndex = formLayout.FormFields.findIndex(field => field.NextQuestionSet != null)
        if (firstDynamicFieldIndex > 0) {
            const lastDynamicField = formLayout.FormFields.find((field, index) => {
                if (firstDynamicFieldIndex + 1 > index) {
                    fieldsToDisplay.add(field.Id);
                }
                else if (field.NextQuestionSet) {
                    const fieldValue = source && source[field.Id] ? source[field.Id].toString() : null;
                    if (fieldValue) {
                        fieldsToDisplay.add(field.Id);

                        //Next Question Generation
                        const anyQuestion = field.NextQuestionSet.find((items: any) => items.Key === 'any');
                        let nextFields;
                        if (anyQuestion) {
                            nextFields = anyQuestion.Value
                        }
                        else {
                            const question = field.NextQuestionSet.find((items: any)  => items.Key === fieldValue);
                            nextFields = question ? question : null;
                        }

                        if (nextFields) {
                            nextFields.forEach((next: any) => fieldsToDisplay.add(next));
                        }

                        return false;
                    }
                    else {
                        return true;
                    }
                }

            });

            formLayout.FormFields.forEach((field, index) => {
                if (fieldsToDisplay.has(field.Id)) {
                    field.Hidden = false;
                }
                else {
                    field.Hidden = true;

                }
            })
        }
        const needsToPreload = formLayout.FormFields.find(_formField => _formField.ApiEndpoint) ? true : false;
        if (loadOptions && needsToPreload) {
            // this.loadSelectOptions(formLayout.FormFields, source, formLayout).subscribe((data:any) => {
            //     this.addControls(formLayout.Form, formLayout.FormFields, source, disableAll)
            // });
        }
        else {if(typeof window !== "undefined"){
            this.addControls(formLayout.Form, formLayout.FormFields, source, disableAll)

        }
        }
    }

    addControls(form: FormGroup, formFields: FormField[], source?: any, disableAll = false) {
        formFields.forEach(_formField => {
            if (_formField.Hidden === false && _formField.Type !== 'Message') {
                const validators = FormUtils.getValidators(_formField);
                const value = this.getSourceValue(source, _formField);
                if (_formField.IsToggled) {
                    _formField.Hidden = true;
                }
                form.addControl(_formField.Id, new FormControl(value, validators));
                if (_formField.Required) {
                    form.controls[_formField.Id].markAsTouched({ onlySelf: true });
                }
                if (disableAll) {
                    _formField.Disabled = true;
                }
            }
            else {
                form.removeControl(_formField.Id);
            }
        });
    }
    
    removeControl(form: FormGroup, formField: FormField){
        form.removeControl(formField.Id);
    }

    reAddControl(form: FormGroup, formField: FormField, value:any){
        this.removeControl(form, formField);
        if (formField.Hidden === false && formField.Type !== 'Message') {
            const validators = FormUtils.getValidators(formField);
            if (formField.IsToggled) {
                formField.Hidden = true;
            }
            form.addControl(formField.Id, new FormControl(value, validators));
            if (formField.Required) {
                form.controls[formField.Id].markAsTouched({ onlySelf: true });
            }
        }
    }   

    getSourceValue(source: any, configuration: FormField): any {
        let value;

        if (source) {
            if (configuration.Type === FormFieldType.Date) {
                const propertyValue = source[configuration.Id];
                const date = propertyValue ? new Date(propertyValue) : null;

                value = date || null;
            } else {
                value = source[configuration.Id];
                if (configuration.Type === FormFieldType.Select) {
                    value = this.selectValue(configuration, value);
                    if (value === '') {
                        value = null;
                    }
                }
                else if (configuration.Type === FormFieldType.MultiSelect) {
                    const valueList = new Array();
                    if (value && value.length > 0) {
                        value.forEach((item:any)=> {
                            valueList.push(this.selectValue(configuration, item));
                        });
                        value = valueList;
                    }
                } else if (configuration.Type === FormFieldType.Checkbox) {
                    value = value;
                }
            }
        } else if (configuration.Type === FormFieldType.Checkbox) {
            // If the source object is undefined, we are defaulting
            // radio form controls to false.
            value = null;
        } else {
            if (configuration.Type === FormFieldType.Date) {
                value = configuration.Value;
            }
        }
        return value;
    }

    selectValue(configuration: FormField, item: any) {
        let result;
        let resultKey;
        if (configuration.Options) {
            configuration.OptionValue ?
                result = configuration.Options.find(kvp => kvp[configuration.OptionValue] === item)
                : resultKey = configuration.Options.find(kvp => kvp.Value === item);
        }

        const returnValue = result ?
            result : resultKey ?
                resultKey : null;
        configuration.Value = returnValue;
        return returnValue;

    }

    // loadSelectOptions(formFields: FormField[], source?: any, formLayout?: FormLayout): Observable<any> {
    //     let apiCallItems: Observable<any>[] = [];
    //     const itemsNeedServiceCall: Array<any> = [];
    //     const itemsCompleted: Array<any> = [];

    //     formFields.forEach((_formField) => {
    //         if (_formField.ApiEndpoint && ((source && source[_formField.Id] && _formField.Type === FormFieldType.SelectTable) || (_formField.Type === FormFieldType.Select))) {
    //             const dataRequest = new DataRequest();

    //             source && source[_formField.Id] && _formField.Type === FormFieldType.SelectTable ? dataRequest.Request[_formField.OptionValue] = source[_formField.Id] : null;

    //             const observable = this.genericHttpService.getDataPost(
    //                 _formField.ApiController,
    //                 _formField.ApiEndpoint,
    //                 dataRequest
    //             );

    //             apiCallItems.push(observable);
    //             itemsNeedServiceCall.push(_formField);
    //         }
    //     });
    //     return apiCallItems && apiCallItems.length > 0 ? forkJoin(apiCallItems).pipe(
    //         map((optionData) => {
    //             for (let i = 0; i < optionData.length; i++) {
    //                 itemsNeedServiceCall[i].Options = optionData[i];
    //             }
    //             this.emitFormOptionsComplete(formLayout);
    //             return itemsNeedServiceCall;
    //         })
    //     ) : of({});

    // }

    // selectTableValue(formField: FormField, value: any) {

    //     let result;
    //     let resultKey;

    //     if (formField.Options && formField.Options.length == 1) {
    //         formField.Value = formField.Options[0];
    //         result = formField.Value[formField.OptionKey]
    //     }
    //     else {
    //         resultKey = formField.Options.find(kvp => kvp.Value === value);
    //         formField.Value = resultKey ? resultKey[0] : null;
    //     }
    //     return result ?
    //         result : resultKey ?
    //             resultKey : value;
    // }


}
export default FormService
