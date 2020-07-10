import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import Form from 'react-bootstrap/Form'

import { Formik } from 'formik'

import { connect } from 'react-redux'

import actions from '../../actions'
import * as schemas from '../../lib/schemas'

export default connect(null, actions)(class Login extends Component {

  onSubmit = (form, { resetForm, setSubmitting }) => {
    setSubmitting(true)
    return this.props.registerUser(form).then(() => {
      setSubmitting(false)
    }).catch(() => {
      setSubmitting(false)
    })
  }

  render() {
    return (
      <Formik
        initialValues={{ email: '', password: '', confirm: '' }}
        validationSchema={schemas.signup}
        onSubmit={this.onSubmit}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <Modal.Dialog className="my-5">

            <Modal.Header>
              <Modal.Title>
                Create an account
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    className="my-1"
                    type="text"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid" children={errors.name} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="my-1"
                    type="text"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid" children={errors.email} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="my-1"
                    type="password"
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid" children={errors.password} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    className="my-1"
                    type="password"
                    name="confirm"
                    value={values.confirm}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={!!errors.confirm}
                  />
                  <Form.Control.Feedback type="invalid" children={errors.confirm} />
                </Form.Group>

                <Button block type="submit">
                  Sign Up!
                </Button>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Link to="/login" className="mr-auto">
                Existing user? Log in here!
              </Link>
            </Modal.Footer>

          </Modal.Dialog>
        )}
      </Formik>
    )
  }

})
