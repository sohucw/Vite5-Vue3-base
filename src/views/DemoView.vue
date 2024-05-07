<template>
    <div>
        <button @click="testHandler">测试</button>
    </div>
</template>
<script setup lang="ts">
let testNum: any = 1
const testHandler = () => {
    testNum = null
        if (testNum.length === 1) {
            console.log('出错了')
        }
}
</script>
