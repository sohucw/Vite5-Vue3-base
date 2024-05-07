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
app.config.errorHandler = (err: any, vm) => {
    const stackFrame = ErrorStackParser.parse(err as Error)
    // console.log(stackFrame, 'err')
    const jsError = {
        stack_frames: stackFrame,
        message: err.message,
        stack: err.stack,
        error_name: err.name
    }
    vm?.$message.error(`您触发了一个${err.name} 错误`)
    // findCodeBySourceMap(stackFrame[0])
    localStorage.setItem('jsErrorList', JSON.stringify(jsError))
}
app.mount('#app')

