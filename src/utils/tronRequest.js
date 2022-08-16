import TronWeb from 'tronweb'

const tronWeb = new TronWeb({
})

export const getTrxBalance = address => {
  return tronWeb.trx.getBalance(address)
}
