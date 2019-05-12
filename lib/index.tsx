import * as React from "react";
import { Input, Form, Label, Rating, TextArea } from "semantic-ui-react";
import { UIKit, UIKITFieldProps, UIKitAPI } from 'frontier-forms';

const translations = {
  'firstname': "First name",
  'lastname': "Last name",
  'email': "E-mail",
  'company': "Company name"
}

const FieldWrapper: React.SFC<UIKITFieldProps & { path: string, type: string, required: boolean }> = props => {
  return (
    <p>
      {
        props.type == 'object' ?
          props.children :
          <Form.Field required={props.required}>
            <label htmlFor="">
              {
                translations[props.path] ?
                  translations[props.path] :
                  props.path.charAt(0).toUpperCase() + props.path.slice(1)
              }
            </label>
            {props.children}
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

export const SemanticUIkit: UIKitAPI = UIKit().
  form((form, children) => (
    <form
      className={form.getState().submitting ? 'ui form loading' : 'ui form'}
      onSubmit={(e) => { e.preventDefault(); form.submit(); }}
    >
      <div>
        {children}
      </div>
      <br />
      <p>
        <input type="submit" value="Save" className="ui button" />
      </p>
    </form>
  )).
  type('string', (path, required, children) => {
    return props => (
      <FieldWrapper required={required} type={'string'} path={path} {...props}>
        <Input
          onChange={
            e => {
              const value = e.currentTarget.value;
              props.change(value.length > 0 ? value : null);
            }
          }
          value={props.value}
        />
      </FieldWrapper>
    )
  }).
  path(/rating/ as any, (path, type, required) => {
    return (props: UIKITFieldProps & { maxRating?: number }) => (
      <FieldWrapper required={required} type={type} path={path} {...props}>
        <Rating
          maxRating={props.maxRating || 5}
          onRate={
            (e, { rating }) => {
              props.change(rating);
            }
          }
          value={props.value}
        />
      </FieldWrapper>
    )
  }).
  path(/comment/ as any, (path, type, required) => {
    return props => (
      <FieldWrapper required={required} type={type} path={path} {...props}>
        <TextArea
          value={props.value}
          onChange={e => { const value = e.currentTarget.value; props.change(value.length > 0 ? value : null); }}
        />
      </FieldWrapper>
    )
  })
