import * as React from "react";
import { FormGroup, Input, Checkbox, Select, Form, Label, Message, Popup, Rating, TextArea } from "semantic-ui-react";
import { JSONSchema7TypeName } from 'json-schema'
import { UIKitResolver, UIKITFieldProps } from 'frontier-forms';

const typeToComponentMap: { [k in JSONSchema7TypeName]: React.FunctionComponent | React.ComponentClass | undefined } = {
    object: FormGroup,
    string: Input,
    boolean: Checkbox,
    integer: Input,
    number: Input,
    null: undefined,
    array: Select
}

const UnknownField: React.SFC<{ path: string, type: string }> = props => {
    console.warn(`No component matching for field "${props.path}" with type ${props.type}`);
    return null;
}

export const SemanticUIkit: UIKitResolver = (path, type, required, children) => {
    const Component = typeToComponentMap[type];
    if (!Component) {
        return () => UnknownField({ path, type });
    } else {

        return props => {
            let wrappedComponent;
            if (path.match('rating')) {
                wrappedComponent = React.createElement(
                    Rating,
                    {
                        maxRating: 5,
                        onRate: (e, { rating }) => {
                            props.change(rating);
                        },
                        value: props.value
                    } as any
                );
            } else if (path.match('comment')) {
                wrappedComponent = React.createElement(
                    TextArea,
                    {
                        onChange: e => {
                            const value = e.currentTarget.value;
                            props.change(value.length > 0 ? value : null);
                        },
                        value: props.value
                    } as any
                );
            } else {
                wrappedComponent = React.createElement(
                    Component,
                    {
                        onChange: e => {
                            const value = e.currentTarget.value;
                            props.change(value.length > 0 ? value : null);
                        },
                        value: props.value,
                        children: children
                    } as any
                );
            }
            return (
                <p>
                    {
                        type == 'object' ?
                            wrappedComponent :
                            <Form.Field required={required}>
                                <label htmlFor="">{path.charAt(0).toUpperCase() + path.slice(1)}</label>
                                {wrappedComponent}
                                {
                                    !!props.error && (props.dirty || props.submitFailed) &&
                                    <Label basic color='red' pointing='above'>
                                        {
                                            props.error == 'required' ?
                                                "This field is required" :
                                                "There is an error"
                                        }
                                    </Label>
                                }
                            </Form.Field>
                    }
                </p>
            );
        }
    }
};
