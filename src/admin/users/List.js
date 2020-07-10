import React from 'react'

import {
  List,
  Datagrid,
  TextField,
  EmailField
} from 'react-admin'

export default props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <EmailField source="email" />
      <TextField source="name" />
      <TextField source="role" />
    </Datagrid>
  </List>
)
