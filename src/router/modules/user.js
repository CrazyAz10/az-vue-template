import Layout from '@/layout/Layout'
const userRouter = [
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: '',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: 'user', roles: ['connectWallet', 'user'], noCache: true, affix: true }
      }
    ]
  }
]

export default userRouter
