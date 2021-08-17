import VueRouter from 'vue-router'
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users = () => import('../components/Users/Users.vue')
const Power = () => import('../components/Power/Power.vue')
const Roles = () => import('../components/Power/Roles.vue')
const Categories = () => import('../components/goods/Categories.vue')
const Params = () => import('../components/goods/Params.vue')
const Lists = () => import('../components/goods/Lists.vue')
const Add = () => import('../components/goods/Add.vue')
const Orders = () => import('../components/orders/Orders.vue')
const Reports = () => import('../components/reports/Reports.vue')


const router =  new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          component:Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Power
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/params',
          component: Params
        },
        { 
          path: '/goods',
          component: Lists,
        },
        {
          path: '/goods/add',
          component: Add,
        },
        {
          path: '/orders',
          component: Orders,
        },
        {
          path: '/reports',
          component: Reports,
        }
      ]
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  if(!window.sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
