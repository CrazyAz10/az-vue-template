export default {
  // 只做说明 已作废 配置通过接口获取并保存到store
  contractConfig: {
    '_matureTime': '600', // 最小成熟周期
    '_backlogTime': '3600', // 积压计算时间，如：24小时内入金比总金额的24小时。
    '_cycleYieldsPercent': '50', // 收益率,
    '_minDevelopCustomAmount': '10', // 发展下线最少花费MUT量,
    '_fomoPoolPercent': '45', // fomo奖金截留比率,
    '_sysFundPercent': '10', // 系统维护费截留比率,
    '_resetCountDownTimeLength': '3600', // 倒计时长,
    '_backlogToCountdown': '10', // 重启倒计时触发比率,
    '_landPrice': '100000000000000000000', // 土地价格（MUT）,
    '_minAmountBuy': '10000000000000000000', // 最小播种量,
    '_maxAmountBuy': '10000000000000000000000', // 最大播种量,
    '_charityPercent': '5', // 慈善基金截留比率,
    '_sharedPercent': [
      '40',
      '30',
      '10',
      '5'
    ] // 分销等级和返佣比率数组
  }
}
