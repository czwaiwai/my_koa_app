<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
// import HelloWorld from './components/HelloWorld.vue'
const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.isLogin ? userStore.userInfo : {}
})
const router = useRouter()
const handleLogout = () => {
  userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->
      <nav>
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
        <template v-if="userStore.isLogin">
          <RouterLink to="/game">游戏</RouterLink>
          <RouterLink to="/profile">{{ userInfo.userName }}</RouterLink>
          <a @click="handleLogout">退出</a>
        </template>
        <template v-else>
          <RouterLink to="/login">登录</RouterLink>
          <RouterLink to="/register">注册</RouterLink>
        </template>
      </nav>
    </div>
  </header>
  <div class="container">
    <RouterView />
  </div>
</template>

<style>
body {
  padding: 0;
  margin: 0;
}
#app {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  padding: 0;
}
header {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}
.container {
  flex: 1;
  width: 100%;
  padding: 1rem;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
