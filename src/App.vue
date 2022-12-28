<script setup lang="ts">
const posts = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
];
</script>

<template>
  <div class="body">
    <div class="cover">
      <h2>Cover</h2>
    </div>
    <div class="line" v-for="i in posts" :key="i.id">
      <span>标题 {{ i }}</span>
    </div>
  </div>
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
}

.cover {
  height: 200px;
  background: red;
}

.line {
  display: flex;

  padding: 10px 20px;
  border-bottom: 1px solid lightblue;
}
</style>
