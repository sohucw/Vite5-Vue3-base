<template>
    <div v-if="isError">
        <pre>
      {{ js_error.stack }}
    </pre
        >
        <el-collapse v-model="activeName" accordion>
            <el-collapse-item
                v-for="(item, index) in js_error.stack_frames"
                :key="index"
                :title="substrSourceTitle(item.source)"
                :name="index"
            >
                <el-row :gutter="20">
                    <el-col :span="20">
                        <div>{{ item.fileName }}</div>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="small" type="primary" @click="oepnDialog(item, index)"
                            >映射源码</el-button
                        >
                    </el-col>
                </el-row>
                <el-col :span="20">
                  <template v-if="item.origin">
                    <PreCode v-if="item.origin" :orgin="item.origin"></PreCode>
                  </template>
                  <template v-if="!item.origin">
                    <div >{{item.fileName}}</div>
                  </template>
                </el-col>
            </el-collapse-item>
        </el-collapse>

    </div>
    <el-dialog
      title="sourceMap映射"
      v-model="visible"
      width="500px"
      :before-close="handleClose">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="本地上传" name="local">
          <el-upload
            style="width: 100%"
            class="upload-demo"
            drag
            action=""
            :before-upload="sourceMapUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="request">远程加载</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import sourceMap from 'source-map-js'
import { onMounted, reactive, ref } from 'vue';
import PreCode from './PreCode.vue'
const activeName = ref('1')
const activeTabName = ref('1')
let isError = ref(false);
let visible = ref(false);
let js_error = ref<any>(null);

let stackFrameObj = {
  line: 0,
  cloum: 0,
  index: 0,
};
onMounted(() => {
    try {
        let js_error_info = localStorage.getItem('jsErrorList')
        if (js_error_info) {
          isError.value = true;
          js_error.value = JSON.parse(js_error_info)
            console.log(js_error.value)
        }
    } catch (err) {
        console.log(err)
    }
})
const substrSourceTitle = (str: string) => {
  return  str.substring(0, 100) + '...'
}
const oepnDialog = (stackFrame: any, index: number) => {
  stackFrameObj = {
      line: stackFrame.lineNumber,
      cloum: stackFrame.columnNumber,
      index: index,
  };
  visible.value= true;
};
const sourceMapUpload =  async (file: any) => {
    if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'map') {
    alert(`请上传.js.map 文件！`);
      return
    }
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = async event => {
      const look_source = await lookSource(event!.target!.result, stackFrameObj.line, stackFrameObj.cloum)
      js_error.value.stack_frames[stackFrameObj.index].origin = look_source
      visible.value = false;
    }
    return false
}
const lookSource = async(source_map: any, line: number, column: number) => {
  try {
    const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(source_map));
    const lookUpRes = consumer.originalPositionFor({
      line: line,
      column: column
    })
    const source = consumer.sourceContentFor(lookUpRes.source)
    return {
      source,
      column: lookUpRes.column,
      line: lookUpRes.line
    }
  } catch(e) {
    alert(`未能解析出sourceMap！`);
    console.log(e);
    return null
  }
}
const handleClose = (done: any)=> {
  done();
}
</script>
