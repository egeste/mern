import React from 'react'

import { Edit, SimpleForm } from 'react-admin'
import Fields from './Fields'

export default ({ permissions, ...props }) => (
  <Edit {...props}>
    <SimpleForm>
      <Fields permissions={permissions.updateAny('users')}/>
    </SimpleForm>
  </Edit>
)
