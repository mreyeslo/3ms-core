import * as React from "react";
import { render } from "react-dom";
import {
  FormBuilder,
  AbstractControl,
  Validators,
  FormGroup,
  FormArray,
  FieldGroup,
  FieldControl,
  FieldArray
} from "react-reactive-form";
import { FieldLayout, FormField } from "../models/form/form-field";
import { FormFieldType } from "../models/form/form-field-type";
import { FormLayout } from "../models/form/form-layout";
import { FormService } from "../services/form.service";
import { FormUtils } from "../utils/form-utils";

class Index extends React.Component<any, any> {
  formService = FormService.getInstance(null);

  //-------Form Fields
  setProjectLayout = () => {
    const formFields: FormField[] = [
      { Id: 'objectId', Label: 'Object Id', Required: false, Disabled: true, Type: FormFieldType.Text, FieldLayout: FieldLayout.Horizontal },
      { Id: 'name', Label: 'Name', Required: true, Type: FormFieldType.Text, FieldLayout: FieldLayout.Horizontal },
    ];

    const formLayout = new FormLayout(formFields);
    this.formService.initializeForm(formLayout, null, true);
    return formLayout;
  }

  formLayout = this.setProjectLayout();

  handleSubmit(values: any) {
    console.log(FormUtils.getFormValues(this.formLayout));
  }

  handleReset() {
    this.formLayout.Form.reset();
  }

  render() {
    return (
      <FieldGroup
        control={this.formLayout.Form}
        render={({ value, pristine, invalid }) => (
          <div>
            <h2>Add Product Form</h2>
            <form>
              {this.formLayout.FormFields.map((form, index) => (
                <FieldControl
                  name={form.Id}
                  render={({
                    handler,
                    pending,
                    touched,
                    hasError
                  }: AbstractControl) => (
                    <div>
                      <label>{form.Label}:</label>
                      {
                        form.Type === FormFieldType.Text &&
                        <input {...handler()} />
                      }
   {
                        form.Type === FormFieldType.Select &&
                        <input {...handler()} />
                      }
                      {pending && <i className="fa fa-spinner fa-spin" />}
                      <div>
                        <span>
                          {touched &&
                            hasError("required") &&
                            "field is required"}
                        </span>
                      </div>
                    </div>
                  )}
                />
              ))}


            </form>
            <div>
              <button disabled={pristine || invalid} onClick={() => { this.handleSubmit(this.formLayout.Form) }}>fgdfgdf</button>
              <button type="button" onClick={() => this.handleReset()}>
                Reset
              </button>
            </div>
          </div>
        )}
      />
    );
  }
}

export default Index;
