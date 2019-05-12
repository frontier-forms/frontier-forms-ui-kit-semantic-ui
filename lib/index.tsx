import * as React from "react";
import { Input, Form, Label, Rating, TextArea, Button } from "semantic-ui-react";
import { UIKit, UIKITFieldProps, UIKitAPI } from 'frontier-forms';

const translations = {
  'createUser.firstname': "First name",
  'createUser.lastname': "Last name",
  'createUser.email': "E-mail",
  'createUser.company': "Company name",
  'createFeedback.rating': 'How was your stay?',
  'createFeedback.comment': 'Please leave a feedback about the property',
  'createCatContestRegister.firstname': 'Your first name',
  'createCatContestRegister.lastname': 'Your last name',
  'createCatContestRegister.cats': 'Select the cats that will participate',
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
                  props.path
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
          value={typeof props.value === 'undefined' ? '' : props.value}
        />
      </FieldWrapper>
    )
  }).
  type('array', (path, required, children) => {
    return (props: UIKITFieldProps & { list?: { name: string }[] }) => {
      const values = (props.value || []) as { name: string }[];
      const list = props.list || [];
      const change = (values) => props.change(values);
      return (
        <FieldWrapper required={required} type={'string'} path={path} {...props}>
          <ul>
            {
              values.map(val => (
                <li>
                  {val.name}&nbsp;
                  <Button
                    color='red'
                    onClick={e => {
                      e.preventDefault()
                      change(values.filter(v => v.name !== val.name))
                    }}
                  >
                    remove
                  </Button>
                </li>
              ))
            }
          </ul>
          <br />
          <ul>
            {
              list.filter(v => !values.find(vv => vv.name == v.name)).map(val => (
                <li>
                  {val.name}&nbsp;
                  <Button
                    color='blue'
                    onClick={e => {
                      e.preventDefault()
                      change(values.concat({ name: val.name }))
                    }}
                  >
                    add
                  </Button>
                </li>
              ))
            }
          </ul>
        </FieldWrapper>
      )
    };
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
          value={typeof props.value === 'undefined' ? 0 : props.value}
        />
      </FieldWrapper>
    )
  }).
  path(/comment/ as any, (path, type, required) => {
    return props => {
      return (
        <FieldWrapper required={required} type={type} path={path} {...props}>
          <TextArea
            value={typeof props.value === 'undefined' ? '' : props.value}
            onChange={e => { const value = e.currentTarget.value; props.change(value.length > 0 ? value : null); }}
          />
        </FieldWrapper>
      )
    };
  })
