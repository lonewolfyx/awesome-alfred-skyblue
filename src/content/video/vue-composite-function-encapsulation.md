# vue 组合式函数封装

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7579644982785559850)
* [哔哩哔哩](https://www.bilibili.com/video/BV1UV2tBgEPK)

</div>

### 核心代码

```ts
import {unref, watch} from "vue";

export const useEventListener = (...args) => {

    const target = typeof args[0] === 'string' ? window : args.shift()

    return watch(
        () => unref(target),
        (element, _, onCleanup) => {
            if (!element) return;
            element.addEventListener(...args)

            onCleanup(() => {
                element.removeEventListener(...args)
            })
        },
        {
            immediate: true
        }
    )
}
```

### 使用 Demo

```vue
<template>
    <div ref="containerRef" class="container"/>
</template>

<script lang="ts" setup>
import {useTemplateRef} from "vue";
import {useEventListener} from "@/components/useEventListener.ts";

const containerRef = useTemplateRef('containerRef')

const move = () => {
    console.count('move')
}

const off = useEventListener('mousemove', move)
setTimeout(() => {
    off()
}, 1000)
</script>

<style scoped>
.container {
    width: 200px;
    height: 200px;
    background: #181818;
}
</style>
```
