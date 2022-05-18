import { ObjectUtils } from '../../utils/object-utils';
import { FormFieldType } from './form-field-type';

export class FormField {
    Id: string = null;
    QuestionId?: string = null;
    Label: string = null;
    Value?: any = null;
    Type: FormFieldType = null;
    Placeholder?: string | number | Date | boolean = null;
    Required ?= false;
    RequiredTrue ? = false;
    // fields that are required in order for input to be enabled
    RequiredParentSet?: string[] = null
    NextQuestionSet?: any = null;
    // use this fields value as a parameter for api calls
    DependentFields?: string[] = null
    ExcludeInRequest? = false;
    Request?: any = null

    MaxLength?: number = null;
    MinLength?: number = null;
    MinNumber?: number = null;
    MaxNumber?: number = null;
    MinDate?: Date = null;
    MaxDate?: Date = null;

    Pattern?: string | RegExp = null;
    PatternErrorMessage?: string = null;
    MinNumberErrorMessage?: string = null;
    MaxNumberErrorMessage?: string = null;
    Mask ?: string | RegExp = null;
    RemoveMaskCharacter ?: string | RegExp = null;
    Options?: any[] = null;
    OptionKey ?= 'Key';
    OptionValue ?= 'Value';
    ShowClear?=true;
    NoResponse?=false;
    Hidden ?= false;
    Disabled ?= false;
    DoNotSubmit ?= false;

    Order?: number = null;
    SelectEditable ?= false;
    IsToggled ?= false;
    IsEmail ?= false;
    CanReset ?= true;
    Columns ?= Array<any>();
    ApiController?: string = null;
    ApiEndpoint?: string = null;

    SelectTableField?: string = null;
    // setup for label and input display
    GridSize ?= GridSize.p12;
    FieldLayout ?= FieldLayout.Vertical;
    FieldGrid ?= new FieldGrid();

    InputClass ?= "";

    // events for various types of inputs
    refreshOptions?: FormControlOptionsRefreshHandler = null;
    valueChanged?: FormControlValueChangedHandler = ObjectUtils.NoOp;

    constructor(init?: Partial<FormField>) {
        ObjectUtils.clone(init, this);
        this.Hidden =  init && init.Hidden? true:false;
    }
}

// Question and Answer layout, if horizotal set grid sizes: p-lg-3, etc
export enum FieldLayout {
    Vertical = 0,
    Horizontal = 1
}

// Used when FieldLayout
export class FieldGrid {
    LabelGridSize = GridSize.p4;
    InputGridSize = GridSize.p8;
}

export enum GridSize {
//  ColumnLMS responsive grid options, L=large table size, M=medium table size
//  ResponsiveSize421 will show 4 elements per grid row on large window sizes, 2 elements on medium, 1 on small
    ResponsiveSize421 = 'p-lg-3 p-md-6 p-sm-12',
    ResponsiveSize321 = 'p-lg-4 p-md-6 p-sm-12',
    ResponsiveSize221 = 'p-lg-6 p-md-6 p-sm-12',

    p12 = 'p-col-12',
    p10 = 'p-col-10',
    p8 = 'p-col-8',
    p6 = 'p-col-6',
    p4 = 'p-col-4',
    p2 = 'p-col-2',

}

export type FormControlOptionsRefreshHandler = (param?: any) => Lookup[];
export type FormControlValueChangedHandler = (event: any, param1?: any, param2?: any) => void;
