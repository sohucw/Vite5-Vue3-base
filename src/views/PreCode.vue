<template>
    <div class="pre_code">
        <div class="errdetail">
            <pre class="errCode" v-html="preLineStartEnd()"></pre>
        </div>
    </div>
</template>
<script >
export default {
    name: 'PreCode',
    props: {
        orgin: Object
    },
    methods: {
        preLineStartEnd() {
            // 先获取源码有多少行
            const transformationLine = this.orgin.source.split('\n')
            const len = transformationLine.length - 1
            const start = this.orgin.line - 3 >= 0 ? this.orgin.line - 3 : 0
            const end = start + 5 >= len ? len : start + 5 // 最多展示6行
            const line = this.orgin.line
            let newLines = []
            for (var i = start; i <= end; i++) {
                const content = i + 1 + '.    ' + this.encodeHTML(transformationLine[i])
                newLines.push(
                    `<div class='code-line ${i + 1 == line ? 'heightlight' : ''}'>${content}</div>`
                )
            }
            return newLines.join('')
        },
        encodeHTML(str) {
            if (!str || str.length == 0) return ''
            return str
                .replace(/&/g, '&#38;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&#39;')
        }
    }
}
</script>

<style>
.errCode {
    padding: 10px;
    overflow: hidden;
    font-family: consolas, monospace;
    word-wrap: normal;
}
.code-line {
    padding: 4px;
}

.heightlight {
    color: #fff;
    background-color: #f12926;
}
</style>
