import axios from '../../axios'

export async function getUserList() {
  return await axios.get('/admin/user/list/v1')
}

export async function deleteUser(id) {
  return await axios.patch(`/admin/user/delete/${id}/v1`)
}

export async function addUser(data) {
  return await axios.post('/admin/user/create/v1',  data?.data )
}

export async function updateUser(data) {
  return await axios.put(`/admin/user/edit/${data?.editId}/v1`,  data?.data )
}

export async function getUserById(id) {
  return await axios.get(`/admin/user/view/${id}/v1`)
}


export async function changeUserStatus(data) {
  const id = data?.id
  delete data?.id
  return await axios.put(`/admin/user/edit/${id}/v1`, { eStatus: data?.eStatus })
}