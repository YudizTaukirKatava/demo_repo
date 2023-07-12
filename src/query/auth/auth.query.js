import axios from '../../axios'

export async function login({ sEmail, sPassword }) {
  return await axios.post('/admin/auth/login/v1', {
    sLogin: sEmail,
    sPassword
  })
}

export async function forgotPassword({ sEmail }) {
  return await axios.post('/admin/auth/password/forgot/v1', {
    sEmail
  })
}

export async function resetPassWord({ sNewPassword, token }) {
  return await axios.post(
    `/admin/auth/password/reset/v1/${token}`,
    { sPassword: sNewPassword },
  )
}

export async function logout() {
  return await axios.get(`/admin/profile/logout/v1`)
}

export async function changePassWord({ sPassword, sNewPassword }) {
  return await axios.patch(`/admin/profile/update/password/v1`, { sPassword, sNewPassword })
}
