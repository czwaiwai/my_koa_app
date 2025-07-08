<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/index.js'
import api from '@/lib/api'

defineOptions({
  name: 'RegisterView',
})
const userStore = useUserStore()
const user = userStore.userInfo
const gameList = ref([
  {
    category: '20',
    gameType: '1',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
  {
    category: '20',
    gameType: '2',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
  {
    category: '20',
    gameType: '3',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
  {
    category: '20',
    gameType: '4',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
  {
    category: '20',
    gameType: '5',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
  {
    category: '20',
    gameType: '6',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
  {
    category: '20',
    gameType: '7',
    minBet: '1',
    oddsLimit: '2',
    singleBetLimit: '3',
    singleItemLimit: '4',
    rebate: '5',
    odds: '6',
  },
])
const getProfile = () => {
  api.profile().then((res) => {
    console.log(res)
    if (res.user.gameSettings.length) {
      gameList.value = res.user.gameSettings.map(({ id, ...setting }) => {
        console.log(setting)
        return setting
      })
    }
  })
}
getProfile()

const save = () => {
  return api
    .userGameSettingSave({
      userId: user.id,
      settings: gameList.value.map((item) => ({
        category: item.category,
        gameType: item.gameType,
        minBet: item.minBet,
        oddsLimit: item.oddsLimit,
        singleBetLimit: item.singleBetLimit,
        singleItemLimit: item.singleItemLimit,
        rebate: item.rebate,
        odds: item.odds,
      })),
    })
    .then((res) => {
      console.log(res)
      if (res.success) {
        alert('设置已保存')
      } else {
        alert('保存失败: ' + res.message)
      }
    })
    .catch((error) => {
      console.error('保存失败:', error)
      alert('保存失败，请稍后再试')
    })
}
const submitHandle = (e) => {
  e.preventDefault()
  save()
  // const formData = new FormData(e.target)
  // console.log(formData)
  // const data = Object.fromEntries(formData.entries())
  // console.log(data)
  // api.updateGameSettings(data).then((res) => {
  //   console.log(res)
  //   if (res.success) {
  //     alert('设置已更新')
  //   } else {
  //     alert('更新失败: ' + res.message)
  //   }
  // }).catch((error) => {
  //   console.error('更新失败:', error)
  //   alert('更新失败，请稍后再试')
  // })
}
</script>
<template>
  <div>
    <h1>用户信息</h1>
    <div>
      <div>用户名称: {{ user.userName }}</div>
      <div>可用信用: {{ user.balance }}</div>
      <div>已用信用: {{ user.usedCredit }}</div>
      <div>最大信用: {{ user.creditMax }}</div>
    </div>
    <div>
      <form @submit="submitHandle">
        <table class="form-table">
          <thead>
            <tr>
              <td>分类</td>
              <td>游戏类型</td>
              <td>最小投注额</td>
              <td>赔率上限</td>
              <td>单注限额</td>
              <td>单项限额</td>
              <td>返利</td>
              <td>赔率</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in gameList" :key="index">
              <td><input v-model="item.category" name="category[]" /></td>
              <td><input v-model="item.gameType" name="gameType[]" /></td>
              <td><input v-model="item.minBet" name="minBet[]" /></td>
              <td><input v-model="item.oddsLimit" name="oddsLimit[]" /></td>
              <td><input v-model="item.singleBetLimit" name="singleBetLimit[]" /></td>
              <td><input v-model="item.singleItemLimit" name="singleItemLimit[]" /></td>
              <td><input v-model="item.rebate" name="rebate[]" /></td>
              <td><input v-model="item.odds" name="odds[]" /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">提交</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-table input {
  width: 80px;
}
</style>
