# vue 中如何优雅的处理按钮 loading

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7558436831654661395)
* [哔哩哔哩](https://www.bilibili.com/video/BV1QtxQzLEu3)

</div>

### 核心代码

```vue
<template>
    <el-button
        :loading="loading" v-bind="omit($attrs, 'onClick')" @click="handleClick"
    >
        <slot />
    </el-button>
</template>

<script lang="ts" setup>
import { omit } from 'lodash-es'
import { ref, useAttrs } from 'vue'

defineOptions({
    name: 'MyButton',
    inheritAttrs: false,
})

const loading = ref(false)
const attrs = useAttrs()

async function handleClick() {
    loading.value = true
    try {
        // 调用父组件传递的点击事件
        await attrs.onClick?.()
    }
    finally {
        loading.value = false
    }
}
</script>
```

### 使用 Demo

```vue
<template>
    <div>
        <MyButton type="primary" @click="onClick">
            获取数据
        </MyButton>
        <div>获取数据{{ state }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import MyButton from '@/components/MyButton.vue'

const state = ref({})

function loadData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: '张三',
                age: 18,
            })
        }, 1000)
    })
}

async function onClick() {
    state.value = await loadData()
}
</script>
```
