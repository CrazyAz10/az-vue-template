<template>
  <div class="game"></div>
</template>

<script>
import AzInputNumber from '@/components/az-input-number'
import clickOutside from '@/directive/clickoutside'
import common from '../mixins/common'
import commonMixins from '@/mixins'
export default {
  components: {
    AzInputNumber
  },
  directives: {
    clickOutside
  },
  mixins: [commonMixins, common],
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped src="./game.scss"></style>
