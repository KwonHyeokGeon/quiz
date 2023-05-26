<template>
  <div class="w-full flex items-center justify-center flex-wrap h-full relative pt-20">
    <div :class="timercount ? '!h-full' : '!h-0'"
      class="bg-white w-full transition-all overflow-hidden absolute left-0 top-0 z-50 flex items-center justify-center">
      <p class="text-4xl font-extrabold flex flex-col items-center">시간이 종료되었습니다!
        <span class="text-base mt-40">{{ smallTimer }}초후 다음문제로 이동</span>
      </p>
    </div>
    <div class="mx-auto w-10/12 lg:w-7/12 flex justify-center items-center flex-wrap ">
      <p class="text-xl" :class="{ 'hidden': current === Number(selectCount) }">
        <span class="text-3xl text-red-500">{{ timer }}</span>
        초 남았습니다.
      </p>
      <div class="h-5 bg-gray-300 basis-full relative rounded-lg">
        <p v-if="current != Number(selectCount)" class="absolute right-2 -top-5 text-xs">{{ current + 1 }} / {{
          selectCount }}</p>
        <p v-else class="absolute right-2 -top-5 text-xs">종료</p>
        <p class="absolute right-2 top-0.5 text-xs">{{ progress + "%" }}</p>
        <div class="h-5 rounded-lg bg-blue-300 transition-all duration-500" :style="{ 'width': progress + '%' }"></div>
      </div>
      <h3
        class="relative font-bold basis-full text-center text-indigo-500 sm:text-2xl lg:text-3xl text-xl mt-10 bg-white rounded-lg p-5">
        {{ userName }}님 <span class="text-black">반갑습니다</span>
        <div class="absolute top-0 left-0 w-full">
          <p v-if="hintUse" :class="closeBtn && 'hidden'"
            class="font-bold sm:text-xl bg-gray-500 text-white rounded-lg p-2 relative">{{
              dataList.QuizList[current].hint }}
            <img @click="clickClose" :src="require(`@/assets/images/ico_x.png`)" alt="닫힘"
              class="w-4 h-4 sm:absolute sm:left-2 sm:top-1/2 sm:-translate-y-1/2 hover:border-white hover:border">
          </p>
          <p v-else-if="hint < 1" :class="closeBtn && 'hidden'"
            class="font-bold text-xl bg-gray-500 text-white rounded-lg p-2">힌트가 모두 소진되었습니다.
            <img @click="clickClose" :src="require(`@/assets/images/ico_x.png`)" alt="닫힘"
              class="w-4 h-4 sm:absolute sm:left-2 sm:top-1/2 sm:-translate-y-1/2 hover:border-white hover:border">
          </p>
        </div>
      </h3>

      <div v-if="current < Number(selectCount)" class="bg-white p-10 my-10 rounded-lg basis-full">
        <p class="text-base sm:text-xl">{{ selectQuestion[current].question }}</p>
        <ul class="flex mt-5 flex-wrap justify-center">
          <li @click="current++; SelectValue(e); hintUse = false;"
            class="flex cursor-pointer font-bold basis-full lg:basis-[49%] text-sm rounded-lg mb-5 p-2.5 lg:p-5 border hover:border-orange-500 transition-all duration-20 hover:text-orange-500"
            v-for="(e, index) in          randomView[current]         " :key="index">
            <span>{{ index + 1 }} 번 : </span>
            <span class="break-all text-center basis-10/12">{{ e[1] }}</span>
          </li>
        </ul>
        <div class="basis-full flex sm:flex-row flex-col justify-between flex-wrap">
          <button @click=" useHint() "
            class="btn-primary bg-green-400 hover:bg-green-600  focus:ring-green-400 basis-4/12 sm:basis-3/12 text-sm"
            :disabled=" hint <= 0 ">힌트 : {{ hint }}개</button>
          <button @click=" clickOpen() " class="btn-primary bg-green-400  mt-2 sm:mt-0  basis-4/12 sm:basis-3/12 text-sm"
            :class=" hintUse && 'hover:bg-green-600 focus:ring-green-400' " :disabled=" !hintUse ">힌트
            다시보기</button>
          <router-link to="/"
            class="btn-primary bg-green-400 mt-2 sm:mt-0 hover:bg-green-600 text-center sm:basis-3/12 text-sm">처음으로</router-link>
        </div>
      </div>
      <div v-else class="mt-10 basis-full font-semibold text-lg sm:text-2xl ">
        <div class="flex justify-between">
          <p> SCORE: {{ Math.floor((resultScore / Number(selectCount)) * 100) }} 점({{ resultScore }} /
            {{Number(selectCount)}}개 정답)</p>
          <router-link to="/" class="btn-primary bg-green-400 hover:bg-green-600 text-center text-sm">처음으로</router-link>
        </div>
       <router-link :to=" { name: 'WrongView', query: { userSelect: userSelect.join('') } } " class="flex justify-center items-center">오답확인</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import quizList from '../assets/quizList.json'
interface QuizType {
  id: number,
  question: string,
  answer: string,
  view: {
    number1: string,
    number2: string,
    number3: string,
    number4: string,
  },
  type: string
}


export default defineComponent({
  name: "QuizView",
  data() {
    return {
      dataList: quizList,
      current: 0,
      userSelect: [] as string[],
      hint: 2,
      hintUse: false,
      timer: 0,
      timercount: false,
      smallTimer: 3,
      wrongAnswer: [] as string[],
      // Type Assertion - 변수명 as 변경할 타입 - vue 값 as 변경할 타입
      /*
      as키워드는 유니온 타입 같은 복잡한 타입을 하나의 정확한 타입으로 줄일 때 사용
      단, 하나의 타입일 때 사용 시 에러 발생
      as 타입은 타입실드 임시해제용
      1. 왜 타입 에러가 나는지 모를 때 임시로 해결하기 위해 사용하거나
      2. 내가 어떤 타입의 데이터가 들어올 지 확실히 알고 있을 때 에러를 방지하기 위해 사용
      */
      userName: this.$route.query.userName,
      selectRandom: this.$route.query.selectRandom,
      selectType: this.$route.query.selectType,
      selectCount: this.$route.query.selectCount,
      MaxCount: 0,
      closeBtn: false
    }
  },
  components: {
  },
  methods:
  {
    SelectValue(e: unknown) {
      this.userSelect.push((e as string)[1])
    },
    useHint(): void {
      if (this.hintUse) { return }
      this.hint--;
      this.hintUse = true
      this.closeBtn = false
    },
    questionCount() {
      this.MaxCount = this.dataList.QuizList.filter((e) => {
        if (this.selectType !== '전체') {
          return e.type === this.selectType
        } else {
          return e.type
        }
      }).length
    },
    clickClose() {
      this.closeBtn = true
    },
    clickOpen() {
      this.closeBtn = false
    },
    startCount() {
      if (this.timer === 5) {
        const intervalId = setInterval(() => {
          this.timer--
          if (!this.timer) {
            clearInterval(intervalId)
            this.current++;
            const interSmall = setInterval(() => {
              this.smallTimer--;
              if (!this.smallTimer) {
                clearInterval(interSmall)
                this.timercount = false
                this.timer = 5
                this.smallTimer = 3
              }
            }, 1000)
            this.timercount = true
          }
        }, 1000)
      }
    },
  },
  computed: {
    progress(): number {
      return Math.floor((this.current / Number(this.selectCount)) * 100)
      // progress 라는 이름의 타입을 넘버로 설정
      // 해당 값을 리턴하는 값은 나머지를 계산하지 않고 버림
      // 그 계산값은 현재의 문제 번호 / 문제의 개수 그 값을 나눈 다음 * 100을 곱한다

      // floor는 소수점 나머지를 내림
      // ceil는 소수점 나머지를 올림
      // round는 반올림
    },
    resultScore(): number {
      return this.selectQuestion.filter((e, index) => {
        return e.answer === this.userSelect[index]
      }).length
    },
    randomView(): Array<Array<[string, unknown]>> {
      return this.selectQuestion.map((e, index) => {
        return Object.entries(this.selectQuestion[index].view).sort(() => Math.random() - 0.5)
      })
    },
    selectQuestion(): QuizType[] {
      return this.dataList.QuizList.filter((e) => {
        if (this.selectType !== '전체') {
          return e.type === this.selectType
        } else {
          return e.type
        }
      })
    },

  },
  created() {
    if (Number(this.selectRandom) != 0) {
      this.selectRandom = "1"
    }
    if (this.selectRandom === '1') {
      this.dataList.QuizList.sort(() => Math.random() - 0.5)
    }
    this.questionCount()
    this.timer = 5
  },
  watch: {
    timer(newValue) {
      if (newValue === 5 && this.current !== Number(this.selectCount)) {
        this.startCount()
      } else if (this.current === Number(this.selectCount)) {
        this.timer = 0
        this.timercount = false
      }
    },
  }
})
</script>

<style></style>