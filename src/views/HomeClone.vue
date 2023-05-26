<template>
  <div class="w-full flex justify-center items-center h-full">
    <div class="mx-auto w-10/12 lg:w-6/12 flex flex-wrap items-center">
      <div class="w-full bg-white rounded-lg p-5 gap-x-5 flex flex-wrap justify-center">
        <input ref="focusInput" @keyup.enter="NameChk" @input="chk()" type="text"
          class="border pl-4 py-2 rounded-md shadow-md outline-none basis-full sm:basis-5/12" v-model="userName">
        <button @click="NameChk()"
          class="text-sm sm:text-base btn-primary bg-blue-500 hover:bg-blue-700 focus:ring-blue-400 sm:py-0 basis-full sm:basis-3/12 mt-5 sm:mt-0">시작하기</button>
        <div class="mt-4 text-xs sm:text-sm font-bold">
          <span v-if="userName != ''" class="block sm:inline-block mb-3">{{ userName }} 님 반갑습니다.</span>
          문제 유형은 {{ selectRandom === "0" ? "기본" : "랜덤 " }}이며, {{ selectType }}카테고리를 선택하였으며 총 {{ dataList.length }}개의 문제
          중 {{ selectCount }} 문제를 선택하셨습니다.
        </div>
      </div>
      <div class="w-full bg-white rounded-lg p-5 mt-5 flex justify-between items-center flex-wrap">
        <div class="flex justify-around basis-full items-center xl:basis-4/12">
          <p
            class="sm:text-sm text-xs btn-primary bg-green-500 hover:bg-green-700 focus:ring-green-400 basis-5/12 text-center">
            랜덤설정
          </p>
          <select v-model="selectRandom" class="border rounded basis-6/12 py-1 text-center">
            <option value="0">기본</option>
            <option value="1">랜덤</option>
          </select>
        </div>
        <div class="flex justify-around basis-full items-center xl:basis-4/12 my-5 xl:my-0">
          <p
            class="sm:text-sm text-xs btn-primary bg-green-500 hover:bg-green-700 focus:ring-green-400 basis-5/12 text-center">
            문제유형
          </p>
          <select @change="selectCount = 1" v-model="selectType" class="border rounded basis-6/12 py-1 text-center">
            <option value="전체">전체({{ dataList.length }}문제)</option>
            <option v-for="(e, index) in uniqueTypes" :key="e" :value="e">{{ e }}({{ cateCount[index] }}문제)</option>
          </select>
        </div>
        <div class="flex justify-around basis-full items-center xl:basis-4/12">
          <p
            class="sm:text-sm text-xs btn-primary bg-green-500 hover:bg-green-700 focus:ring-green-400 basis-5/12 text-center">
            개수설정
          </p>
          <select v-model="selectCount" class="border rounded basis-6/12 py-1 text-center">
            <option v-for="e in cateList.length" :key="e" :value="e">{{ e }}문제</option>
          </select>
        </div>
      </div>
      <div
        class="fixed bg-white left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-50 border rounded-lg duration-700 transition-all w-3/4 sm:w-2/4 lg:w-1/6"
        :class="!userNameEmpty ? 'hidden' : 'block'">
        <h3 class="bg-gray-100 p-2 pl-4">경고창 <span></span></h3>
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
      selectCount: 1
    }
  },
  name: 'HomeView',
  components: {
  },
  methods: {
    chk() {
      const regex = /^[가-힣]*$/;
      if (!regex.test(this.userName)) {
        this.userName = this.userName.replace(/[^가-힣]*/, "")
      }
    },
    NameChk() {
      if (!this.userName) {
        this.userNameEmpty = true
        setTimeout(() => {
          this.userNameEmpty = false
        }, 2000);
      } else {
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
  },
  mounted() {
    (this.$refs.focusInput as HTMLInputElement).focus();
  },
});
</script>
