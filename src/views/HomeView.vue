<template>
  <div class="w-full h-full">
    <div class="font-bold text-xl w-full bg-green-700 h-60 flex justify-center items-center px-4">
      <p class="text-white text-4xl">코딩 Quiz</p>
    </div>
    <div class="mx-auto max-w-7xl mt-20 md:mt-40 flex flex-wrap items-center shadow-2xl rounded-md">
      <div class="w-full bg-white rounded-lg flex flex-wrap justify-center items-center gap-4 mt-10">
        <input ref="focusInput" @keyup.enter="NameChk" type="text" placeholder="이름을 입력해주세요"
          class="border py-2 rounded-md shadow-md outline-none basis-full - px-2 sm:basis-2/6 placeholder:text-center "
          v-model="userName">
        <button @click="NameChk()"
          class="btn-flow text-sm sm:text-base basis-full sm:basis-2/6">시작하기
        </button>
      </div>
      <div class="w-full bg-white rounded-lg p-5 mt-5 flex flex-col items-center flex-wrap">
        <div class="flex flex-col md:flex-row w-8/12 items-center my-4 gap-4">
          <select v-model="selectRandom" class="border rounded py-1 basis-1/2 text-center">
            <option value="0">기본</option>
            <option value="1">랜덤</option>
          </select>
          <p
            class="sm:text-sm text-xs btn-flow text-center basis-1/2">
            랜덤설정
          </p>
        </div>
        <div class="flex flex-col md:flex-row w-8/12 items-center my-4 gap-4">
          <select @change="selectCount = 1" v-model="selectType" class="border basis-1/2 rounded py-1 text-center">
            <option value="전체">전체({{ dataList.length }}문제)</option>
            <option v-for="(e, index) in uniqueTypes" :key="e" :value="e">{{ e }}({{ cateCount[index] }}문제)</option>
          </select>
          <p
            class="sm:text-sm text-xs btn-flow basis-1/2 text-center">
            문제유형
          </p>
        </div>
        <div class="flex flex-col md:flex-row w-8/12 basis-full items-center gap-4 my-4">
          <select v-model="selectCount" class="border rounded py-1 text-center basis-1/2">
            <option v-for="e in cateList.length" :key="e" :value="e">{{ e }}문제</option>
          </select>
          <p
            class="sm:text-sm text-xs btn-flow text-center basis-1/2">
            개수설정
          </p>
        </div>
      </div>
      <div
        class="fixed bg-white left-1/2 top-[15%] -translate-x-1/2 -translate-y-1/2 z-50 border rounded-lg duration-500 transition-all w-3/4 sm:w-2/4 lg:w-1/6 shadow-2xl"
        :class="!userNameEmpty ? 'opacity-0' : ' opacity-100'">
        <h3 class="bg-red-500 rounded-tl-lg rounded-tr-lg p-2 pl-4 relative">경고창
          <img @click="removeBtn()" :src="require(`@/assets/images/ico_x.png`)" alt="취소버튼"
            class="w-5 h-5 cursor-pointer hover:border-white hover:border absolute right-2 top-1/2 -translate-y-1/2">
        </h3>
        <p class="p-4 py-6">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import quizList from '../assets/quizList.json'
import { RouteLocationRaw } from 'vue-router';

interface Quiz {
  id: number,
  question: string,
  answer: string,
  view: {
    number1: string,
    number2: string,
    number3: string,
    number4: string
  },
  type: string,
  hint: string
}

export default defineComponent({
  data() {
    return {
      errorMsg: "이름을 입력해주세요",
      userName: "",
      userNameEmpty: false,
      dataList: [] as Quiz[],
      selectRandom: "0",
      selectType: "전체",
      selectCount: 1,
      todayDate: ""
    }
  },
  name: 'HomeView',
  methods: {
    NameChk() {
      if (!this.userName) {
        this.userNameEmpty = true;
        (this.$refs.focusInput as HTMLInputElement).focus();
        setTimeout(() => {
          this.userNameEmpty = false
        }, 5000);
      } else {
        this.userNameEmpty = false
        const route: RouteLocationRaw = {
          name: "QuizView",
          query: {
            userName: this.userName,
            selectRandom: this.selectRandom,
            selectType: this.selectType,
            selectCount: this.selectCount
          },
          replace: false
        }
        this.$router.push(route)
      }
    },
    removeBtn() {
      this.userNameEmpty = false
    }
  },
  computed: {
    // 특정 속성을 추출해서 새로운 배열을 만들기 위해 Set 객체를 사용한다. > 중복된 값을 허용하지 않는 데이터 집합 > 새로운 배열로 다시 반환
    // 우리가 원하는 배열에서 중복값을 제거하고 유일한 값을 배열로 생성
    uniqueTypes(): string[] {
      return [...new Set(this.dataList.map((e) => e.type))]
    },
    cateCount(): number[] {
      return this.uniqueTypes.map((e) => {
        return this.dataList.filter((item) => {
          return e === item.type
        }).length
      })
    },
    cateList(): Quiz[] {
      return this.dataList.filter((e) => {
        if (this.selectType !== '전체') {
          return e.type === this.selectType
        } else {
          return e.type
        }
      })
    }
  },
  created() {
    this.dataList = quizList.QuizList as Quiz[];
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const formattedDate = `${year}-${month}-${day}`;
    this.todayDate = formattedDate
  },
  mounted() {
    (this.$refs.focusInput as HTMLInputElement).focus();
  },
});
</script>
