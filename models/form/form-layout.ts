import { FormGroup } from "react-reactive-form";
import { ObjectUtils } from "../../utils/object-utils";
import { FormField } from "./form-field";


export class FormLayout {
    Id = ObjectUtils.createGuid();
    FormFields: Array<FormField> = null;
    Form =  new FormGroup({});
    ReadyToRender = false;
    Mode = Mode.ADD;
    lastModified = new Date();
    constructor(formFields?: FormField[]) {
        if (formFields) {
            const transformed = new Array<FormField>();
            formFields.forEach(item => transformed.push(new FormField(item)));
            formFields = transformed;
            this.FormFields = formFields;
        }
    }

    getFormField(id: string) {
        if (id && this.FormFields) {
            return this.FormFields.find(field => field.Id === id);
        }
    }
    getFormControl(id: string) {
      if (id) {
          return this.Form.controls[id];
      }
  }
}

// ADD Mode will not preload form field options
// EDIT Mode will preload form field options to populate fields
export enum Mode {
    ADD,
    EDIT,
    STAGE
}
