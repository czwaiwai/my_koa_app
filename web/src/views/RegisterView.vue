<script setup>
import api from '@/lib/api'
defineOptions({
  name: 'RegisterView',
})
const handleRegister = async (e) => {
  let form = new FormData(e.target)
  // Handle registration logic here
  console.log('Register form submitted')
  let formdata = form.entries().reduce((before, item) => {
    let [key, value] = item
    before[key] = value
    return before
  }, {})
  console.log('Form data:', formdata)

  // Here you would typically send the data to your API
  // For example:
  let res = await api.register({
    ...formdata,
  })
  console.log(res)
}
</script>

<template>
  <div>
    <form @submit.prevent="handleRegister">
      <h1>Register</h1>
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<style lang="less" scoped></style>
