<template>
  <div class="nav">
    <span 
      :class="{'nav-item': true, active: selectedCategory.Id === item.Id}"
      v-for="item in list" :key="item.Id"
      @click="selectCategory(item)">
      {{item.categoryname}}
    </span>
  </div>
</template>

<script>
// 导航栏组件
export default {
  name: 'nav',
  props: ['list','defaultCategory'],
  data () {
    return {
      text: 'ceshi',
      selectedCategory: {}
    }
  },
  mounted () {},
  watch: {
    defaultCategory (curVal, oldVal) {
      // console.log(curVal, oldVal)
      this.selectedCategory = curVal
    }
  },
  methods: {
    selectCategory (item) {
      this.selectedCategory = item
      this.dispatch()
    },
    dispatch () {
      // console.log('通知父组件', this.$refs)
      this.$emit('select-category', this.selectedCategory)
    },
  }
}
</script>

<style scoped>
.nav {
  padding: 10px;
}
.nav-item {
  margin-right: 10px
}
.nav-item.active {
  color: red
}
</style>
