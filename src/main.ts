import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  const parseError = ErrorStackParser.parse(err as Error)
  console.log(parseError, 'err')
  console.log(vm, 'vm')
  console.log(info, 'info')
}

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')

