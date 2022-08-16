
import Layout from '@/layout/Layout'
const developmentsRouter = [
  {
    path: '/documents',
    component: () => import('@/views/documents'),
    hidden: true
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },

  {
    path: '/demo',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'theme',
        component: () => import('@/views/demo/theme'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      },
      {
        path: 'i18n',
        component: () => import('@/views/demo/i18n-demo'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      },
      {
        path: 'pdf',
        component: () => import('@/views/demo/pdf'),
        name: 'pdf',
        meta: { title: 'pdf', icon: 'international' }
      },
      {
        path: 'download',
        name: 'download',
        meta: { title: 'pdf', icon: 'international' },
        component: () => import('@/views/demo/pdf/download.vue')
      }
    ]
  }
]
export default developmentsRouter
