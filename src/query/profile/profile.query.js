import axios from '../../axios'

export async function profile() {
  return await axios.get('/admin/profile/get/v1')
}

export async function updateProfile(profileData) {
  return await axios.post('/admin/profile/edit/v1', profileData)
}

export async function checkToken(sVerifyToken) {
  return await axios.post(`/admin/auth/verify/token/v1/${sVerifyToken}`)
}
