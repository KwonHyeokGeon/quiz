<template>
  <div>
    <template>
      <div v-for="(e,index) in dataList" :key="index">{{e}}</div>
      
      <p>문제: {{ dataList[0].question }}</p>
      <p>선택한 답변: {{ userSelect }}</p>
      <p>정답: {{ dataList[0].answer }}</p>
    </template>
    
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import quizList from '../assets/quizList.json'

export default defineComponent({
  name: 'WrongView',
  data() {
    return {
      dataList: quizList.QuizList,
      userSelect: this.$route.query.userSelect
    }
  },


})
</script>

<style></style>
