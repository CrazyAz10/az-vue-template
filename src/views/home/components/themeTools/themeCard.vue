<template>
  <div class="theme-card-wrap" :class="className">
    <div class="theme-card">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: function() {
        return 'primary'
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    className: function() {
      var name = {
        'primary': this.type === 'primary',
        'purple': this.type === 'purple'
      }
      return name
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/theme.scss";

@mixin themeCard($--bg-color,$--shadown-color) {
    position: relative;
    z-index: 5;
    .theme-card{
        position: relative;
        // padding: 30px;
        border-radius: 32px;
        height: 100%;
        background: $--bg-color;
        &::before{
            display: block;
            content: '';
            width: 100%;
            height: 100%;
            background: $--shadown-color;
            position: absolute;
            left: 0;
            bottom: -6px;
            z-index: -1;
            border-radius: 32px;
        }
    }
}
.theme-card-wrap.primary{
    @include themeCard(#FFF9F1,#EE8F13)
}
.theme-card-wrap.purple{
    @include themeCard(#F7F6FE,#6F65EE)
}
</style>
