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
    return this.props.createSession(form)
      .then(() => setSubmitting(false))
      .catch(() => setSubmitting(false))
  }

  render() {
    return (
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schemas.login}
        onSubmit={this.onSubmit}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit
        }) => (
          <Modal.Dialog className="my-5">

            <Modal.Header>
              <Modal.Title>
                Login
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form noValidate onSubmit={handleSubmit}>
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

                <Button block type="submit">
                  Login
                </Button>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Link to="/signup" className="mr-auto">
                New user? Sign up now!
              </Link>

              <Link to="/forgot">
                Forgot account?
              </Link>
            </Modal.Footer>

          </Modal.Dialog>
        )}
      </Formik>
    )
  }

})
