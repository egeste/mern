import React from 'react'

import { Create, SimpleForm } from 'react-admin'
import Fields from './Fields'

export default ({ permissions, ...props }) => (
  <Create {...props}>
    <SimpleForm>
      <Fields permissions={permissions.createAny('users')} />
    </SimpleForm>
  </Create>
)
