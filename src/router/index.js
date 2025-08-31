import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'
import EmailSenderPage from '../views/EmailSenderPage.vue'
import ChatbotPage from '../views/ChatbotPage.vue'
import TemplatesPage from '../views/TemplatesPage.vue'
import TemplateListPage from '../views/TemplateListPage.vue'
import UsersPage from '../views/UsersPage.vue'
import SegmentsPage from '../views/SegmentsPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/email-push',
    name: 'EmailSender',
    component: EmailSenderPage
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: ChatbotPage
  },
  {
    path: '/templates',
    name: 'Templates',
    component: TemplatesPage
  },
  {
    path: '/all-templates',
    name: 'AllTemplates',
    component: TemplateListPage
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersPage
  },
  {
    path: '/segments',
    name: 'Segments',
    component: SegmentsPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;