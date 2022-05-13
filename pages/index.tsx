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

class Index extends React.Component<any, any> {
  keyCount = 0;
  productForm = FormBuilder.group({
    customerName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    items: FormBuilder.array([])
  });
  // Creates the unique keys
  getKey = () => {
    return this.keyCount++;
  };
  // Adds an item in Form Array
  addItem(): void {
    const itemsControl = this.productForm.get("items") as FormArray;
    itemsControl.push(this.createItem());
  }
  // Removes an item
  removeItem(index: number): void {
    const itemsControl = this.productForm.get("items") as FormArray;
    itemsControl.removeAt(index);
  }
  createItem(): FormGroup {
    const control = FormBuilder.group({
      name: "",
      description: "",
      price: ""
    });
    // Adding key
    control.meta = {
      key: this.getKey()
    };
    return control;
  }

  handleSubmit(values: any) {
    console.log(values);
  }

  handleReset() {
    this.productForm.reset();
  }

  render() {
    return (
      <FieldGroup
        control={this.productForm}
        render={({ value, pristine, invalid }) => (
          <div>
            <h2>Add Product Form</h2>
            <form>
              <FieldControl
                name="customerName"
                render={({
                  handler,
                  pending,
                  touched,
                  hasError
                }: AbstractControl) => (
                  <div>
                    <label>Name:</label>
                    <input {...handler()} />
                    {pending && <i className="fa fa-spinner fa-spin" />}
                    <div>
                      <span>
                        {touched &&
                          hasError("required") &&
                          "Customer name is required"}
                      </span>
                    </div>
                  </div>
                )}
              />

              <FieldControl
                name="email"
                render={({
                  handler,
                  pending,
                  touched,
                  hasError
                }: AbstractControl) => (
                  <div>
                    <label>Email:</label>
                    <input {...handler()} />
                    {pending && <i className="fa fa-spinner fa-spin" />}
                    <div>
                      <span>
                        {touched &&
                          ((hasError("required") && "Email is required") ||
                            (hasError("email") &&
                              "Please enter a valid email"))}
                      </span>
                    </div>
                  </div>
                )}
              />

              <FieldArray
                name="items"
                render={({ controls }: FormArray) => (
                  <div>
                    <div>
                      <button type="button" onClick={() => this.addItem()}>
                        {" "}
                        Add Item
                      </button>
                    </div>
                    <h2>{controls.length ? "Items:" : null}</h2>
                    {controls.map((productControl: AbstractControl, index) => (
                      <div key={`${productControl.meta.key}-${String(index)}`}>
                        <FieldGroup
                          control={productControl}
                          render={() => (
                            <div>
                              <h2>-----------------------------</h2>
                              <FieldControl
                                name="name"
                                render={({ handler }) => (
                                  <div>
                                    <label>Name:</label>
                                    <input {...handler()} />
                                  </div>
                                )}
                              />
                              <FieldControl
                                name="description"
                                render={({ handler }) => (
                                  <div>
                                    <label>Description:</label>
                                    <input {...handler()} />
                                  </div>
                                )}
                              />
                              <FieldControl
                                name="price"
                                render={({ handler }) => (
                                  <div>
                                    <label>Price:</label>
                                    <input type="number" {...handler()} />
                                  </div>
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => this.removeItem(index)}
                              >
                                {" "}
                                Remove Item
                              </button>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}
              />

            </form>
            <div>
                <button disabled={pristine || invalid } onClick= {()=>{this.handleSubmit(this.productForm) }}>fgdfgdf</button>
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
