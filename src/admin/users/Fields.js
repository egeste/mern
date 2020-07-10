import React, { Fragment } from 'react'
import { TextInput } from 'react-admin'

export default ({ permissions }) => (
  <Fragment>
    <TextInput disabled={!permissions.granted} fullWidth source="email" />
    <TextInput disabled={!permissions.granted} fullWidth source="name" />
    <TextInput disabled={!permissions.granted} fullWidth source="role" />
  </Fragment>
)
