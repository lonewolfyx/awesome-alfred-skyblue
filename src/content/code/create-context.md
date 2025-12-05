# createContext

<div class="tip custom-block">

场景使用：创建上下文数据共享层

</div>

```ts
import {inject, provide} from "@vue/runtime-core";

export function createContext(key = Symbol('')) {
    return [(...args) => provide(key, ...args), (...args) => inject(key, ...args)]
}
```