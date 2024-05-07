import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { findCodeBySourceMap } from './utils/index'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.config.errorHandler = (err, vm) => {
    const stackFrame = ErrorStackParser.parse(err as Error)
    console.log(stackFrame, 'err')
    findCodeBySourceMap(stackFrame[0])
}
app.mount('#app')

