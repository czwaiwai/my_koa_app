<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
// GameView is
defineOptions({
  name: 'GameView',
})
const gameView = ref()
console.log(gameView)
const message = ref('Hello, GameView')

const formAddObj = ref({
  drawNo: '',
  status: '0',
  gameStartTime: '2025-07-09 00:00:00',
  gameEndTime: '2025-07-10 00:00:00',
})

const addGameSubmit = () => {
  console.log(formAddObj.value)
  api.gameCreate(formAddObj.value)
}

const formUpdateObj = ref({
  drawNo: '',
  openTime: '2025-07-10 00:00:00',
  ball5: '',
  qian: '',
  bai: '',
  shi: '',
  ge: '',
  status: '1',
})
const updateGameSubmit = () => {
  console.log(formUpdateObj.value)
  api.gameResult(formUpdateObj.value)
}

const list = ref([])
const getList = () => {
  api.gameList().then((res) => {
    console.log(res)
    list.value = res.games.rows
  })
}
getList()
</script>

<template>
  <div ref="gameView" class="game-view">
    <h1>{{ message }}</h1>
    <fieldset>
      <legend>添加游戏</legend>
      <form @submit.prevent="addGameSubmit">
        <div>
          <label for="drawNo">游戏期号</label>
          <input id="draoNo" type="text" v-model="formAddObj.drawNo" />
        </div>
        <div>
          <label for="drawNo">游戏状态</label><input type="text" v-model="formAddObj.status" />
        </div>
        <div>
          <label for="drawNo">开始时间</label
          ><input type="text" v-model="formAddObj.gameStartTime" />
        </div>
        <div>
          <label for="drawNo">游戏结束</label><input type="text" v-model="formAddObj.gameEndTime" />
        </div>
        <button type="submit">添加</button>
      </form>
    </fieldset>
    <fieldset>
      <legend>游戏结果</legend>
      <form @submit.prevent="updateGameSubmit">
        <div>
          <label for="drawNo">游戏期号</label>
          <input id="draoNo" type="text" v-model="formUpdateObj.drawNo" />
        </div>
        <div>
          <label for="drawNo"> 仟:</label><input type="text" v-model="formUpdateObj.qian" />
        </div>
        <div><label for="drawNo"> 佰:</label><input type="text" v-model="formUpdateObj.bai" /></div>
        <div><label for="drawNo"> 拾:</label><input type="text" v-model="formUpdateObj.shi" /></div>
        <div><label for="drawNo"> 个:</label><input type="text" v-model="formUpdateObj.ge" /></div>
        <div>
          <label for="drawNo">球5：</label><input type="text" v-model="formUpdateObj.ball5" />
        </div>
        <div><button type="submit">添加</button></div>
      </form>
    </fieldset>

    <div>
      <table>
        <thead>
          <tr>
            <th>期号</th>
            <th>状态</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>结算时间</th>
            <th>仟</th>
            <th>佰</th>
            <th>拾</th>
            <th>个</th>
            <th>球5</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.drawNo }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.gameStartTime }}</td>
            <td>{{ item.gameEndTime }}</td>
            <td>{{ item.openTime }}</td>
            <td>{{ item.qian }}</td>
            <td>{{ item.bai }}</td>
            <td>{{ item.shi }}</td>
            <td>{{ item.ge }}</td>
            <td>{{ item.ball5 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.game-view {
  /* Add your styles here */
}
</style>
