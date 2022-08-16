
<template>
  <div>
    <div class="page">
      <span class="pre" @click="prePage">上一页</span>
      <div style="margin: 10px;">{{ pageNum }} / {{ pageTotalNum }} </div>
      <span class="next" @click="nextPage">下一页</span>
    </div>
    <pdf
      :page="pageNum"
      :src="pdfurl"
      @progress="loadedRatio = $event"
      @num-pages="pageTotalNum=$event"
    />
  </div>
</template>
<script>
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
  },
  props: {
    pdfurl: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      url: 'http://image.cache.timepack.cn/nodejs.pdf',
      pageNum: 1,
      pageTotalNum: 1, // 总页数
      loadedRatio: 0 // 当前页面的加载进度，范围是0-1 ，等于1的时候代表当前页已经完全加载完成了
    }
  },
  methods: {
    // 上一页
    prePage() {
      let page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },
    // 下一页
    nextPage() {
      let page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  display: flex;
  justify-content: center;
  .pre,
  .next{
    cursor: pointer;
  }
}
</style>
