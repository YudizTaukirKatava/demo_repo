import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'

function UserRow({ user, index, onStatusChange, onEdit }) {
  return (
    <tr key={user._id} style={{ textAlign: 'center' }}>
      <td>{index + 1}</td>
      <td>{user.sUsername || '-'}</td>
      <td>{user.sFirstName || '-'}</td>
      <td>{user.sLastName || '-'}</td>
      <td>{user.sMobile || '-'}</td>
      <td>{user.eGender || '-'}</td>
      <td>
        <Form.Check
          type="switch"
          name={user._id}
          className="d-inline-block me-1"
          checked={user.eStatus === 'Y'}
          onChange={(e) => onStatusChange(user?._id, e.target.checked)}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <Button variant="link" className="square icon-btn" as={Link} to={route.editViewUser(user?._id)}>
          <i className="icon-visibility d-block" />
        </Button>
        <Button variant="link" className="square icon-btn" as={Link} onClick={() => onEdit('Edit', user._id)}>
          <i className="icon-create d-block" />
        </Button>
      </td>
    </tr>
  )
}
UserRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  onStatusChange: PropTypes.func
}
export default UserRow
