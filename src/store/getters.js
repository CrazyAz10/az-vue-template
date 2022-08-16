const getters = {
  language: state => state.app.language,
  size: state => state.app.size,
  mobileNavSlide: state => state.app.mobileNavSlide,
  noticeSlideBar: state => state.app.noticeSlideBar,
  device: state => state.app.device,
  token: state => state.user.token,
  address: state => state.address.address,
  connectStatus: state => state.address.connectStatus,
  balance: state => state.address.balance,
  commissionReceived: state => state.address.commissionReceived,
  contractConfig: state => state.settings.contractConfig,
  helpVedio: state => state.settings.helpVedio,
  roles: state => state.permission.roles
}
export default getters
