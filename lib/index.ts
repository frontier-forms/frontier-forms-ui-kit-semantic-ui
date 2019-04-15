import * as React from "react";
import { FormGroup, Input, Checkbox, Select, Form, Label, Message } from "semantic-ui-react";
import { JSONSchema7TypeName } from 'json-schema'
import { UIKitResolver, UIKITFieldProps } from 'frontier-forms';
import { createElement } from "react";

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

export const SemanticUIkit: UIKitResolver = (path, type, children) => {
    const Component = typeToComponentMap[type];
    if (!Component) {
        return () => UnknownField({ path, type });
    } else {

        return props => {
            const wrappedComponent = React.createElement(
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

            const error = props.error ?
                React.createElement(Message,
                    {
                        error: true,
                        content: props.error
                    }
                ) :
                null;

            return type == 'object' ?
                wrappedComponent :
                React.createElement(
                    Form.Field,
                    {
                        children: [
                            React.createElement(
                                Label,
                                null,
                                path
                            ),
                            wrappedComponent,
                            error
                        ]
                    }
                )
        }
    }
};
