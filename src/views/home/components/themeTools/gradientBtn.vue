<template>
  <div class="gradient-btn" :class="className" @click="click">
    <div class="wrap-box">
      <slot />
    </div>
    <div v-if="loading" class="lading-mask">
      <i class="el-icon-loading" />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  directives: {
    waves
  },
  props: {
    size: {
      type: String,
      default: function() {
        return 'default'
      }
    },
    type: {
      type: String,
      default: function() {
        return 'primary'
      }
    },
    loading: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    className: function() {
      var name = {
        'max-btn': this.size === 'max',
        'mini-btn': this.size === 'mini',
        'primary': this.type === 'primary',
        'purple': this.type === 'purple',
        'loading': this.loading
      }
      return name
    }
  },
  methods: {
    click() {
      if (this.loading) {
        return
      }
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";
$--default-height: 58px;
$--default-width: 250px;
$--default-font-size: 20px;
$--default-font-weight: normal;
$--default-shadown-bottom: -4px;

$--default-theme-color: linear-gradient(0deg, #FE9B40, #FFB744);
$--default-shadown-color: #F66911;
$--default-shadown-border-color: #DB4B05;

$--max-height: 80px;
$--max-width: 293px;
$--max-font-size: 30px;
$--max-font-weight: bold;
$--max-shadown-bottom: -6px;

$--mini-height: 40px;
$--mini-width: 160px;
$--mini-font-size: 18px;
$--mini-font-weight: bold;
$--mini-shadown-bottom: -3px;

@mixin gradientBtn ($--height,$--width,$--font-size,$--font-weight,$--shadown-bottom,$--theme-color,$--shadown-color,$--shadown-border-color) {
    position: relative;
    display: inline-block;
    z-index: 5;
    border-radius: calc(#{$--height} / 2);
    transition: all .2s;
    vertical-align: middle;
    cursor: pointer;
    &:hover{
        transform: scale(1.05);
        box-shadow: 2px 2px 3px rgba(0,0,0,0.5);
    }
    .lading-mask{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(0,0,0,.4);
      border-radius: calc(#{$--height} / 2);
      text-align: center;
      i{
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 20px;
        margin-left: -10px;
        margin-top: -10px;
      }
    }
    .wrap-box{
        min-width: $--width;
        height: $--height;
        margin-bottom: calc(#{$--shadown-bottom} * -1);
        padding: 0 calc(#{$--height} / 2);
        position: relative;
        background: $--theme-color;
        text-align: center;
        line-height: $--height;
        font-size: $--font-size;
        font-weight: $--font-weight;
        color: #fff;
        border-radius: calc(#{$--height} / 2);
        &::before{
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            bottom: $--shadown-bottom;
            z-index: -1;
            background: $--shadown-color;
            border-radius: calc(#{$--height} / 2);
            border: 1px solid $--shadown-border-color;
        }
    }
}

.gradient-btn.primary{
    @include gradientBtn($--default-height,$--default-width,$--default-font-size,$--default-font-weight,$--default-shadown-bottom,$--default-theme-color,$--default-shadown-color,$--default-shadown-border-color);
    &.max-btn{
        @include gradientBtn($--max-height,$--max-width,$--max-font-size,$--max-font-weight,$--max-shadown-bottom,$--default-theme-color,$--default-shadown-color,$--default-shadown-border-color);
    }
    &.mini-btn{
        @include gradientBtn($--mini-height,$--mini-width,$--mini-font-size,$--mini-font-weight,$--mini-shadown-bottom,$--default-theme-color,$--default-shadown-color,$--default-shadown-border-color);
    }
}

.gradient-btn.purple{
    $--default-theme-color: linear-gradient(0deg, #6F65EE, #6a3ceb);
    $--default-shadown-color: #7121f1;
    $--default-shadown-border-color: #4e1f99;
    @include gradientBtn($--default-height,$--default-width,$--default-font-size,$--default-font-weight,$--default-shadown-bottom,$--default-theme-color,$--default-shadown-color,$--default-shadown-border-color);
    &.max-btn{
        @include gradientBtn($--max-height,$--max-width,$--max-font-size,$--max-font-weight,$--max-shadown-bottom,$--default-theme-color,$--default-shadown-color,$--default-shadown-border-color);
    }
    &.mini-btn{
        @include gradientBtn($--mini-height,$--mini-width,$--mini-font-size,$--mini-font-weight,$--mini-shadown-bottom,$--default-theme-color,$--default-shadown-color,$--default-shadown-border-color);
    }
}

</style>
