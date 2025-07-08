<script setup>
import api from '@/lib/api'
import router from '@/router'
import { useUserStore } from '@/stores'
defineOptions({
  name: 'LoginView',
})
const userStore = useUserStore()
const handleLogin = async (e) => {
  let form = new FormData(e.target)
  // Handle login logic here
  console.log('Login form submitted')
  let formdata = form.entries().reduce((before, item) => {
    let [key, value] = item
    before[key] = value
    return before
  }, {})
  console.log('Form data:', formdata)
  let res = await api.login({
    ...formdata,
  })
  userStore.setUserInfo(res)
  console.log(res)
  router.push('/')
}
</script>

<template>
  <div>
    <form @submit.prevent="handleLogin">
      <h1>Login</h1>
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<style lang="less" scoped></style>
