# 命令式弹窗 - 终极班

<div class="tip custom-block">

场景使用：不知道该用什么弹窗，但是有需求，需要弹窗。

</div>

```ts
import type { DialogProps } from 'element-plus'
import type { App, Component } from 'vue'
import { ElButton, ElConfigProvider, ElDialog } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp, h, ref } from 'vue'

let parentApp: App

export function installRenderDialog(app: App) {
  parentApp = app
}

/**
 * 继承上层 app 的配置
 * @param app
 */
function extendsApp(app: App) {
  if (parentApp) {
    const _app = app._context.app
    Object.assign(app._context, parentApp._context)
    app._context.app = _app
  }
}

type ComponentProps<T> = T extends Component<infer P> ? P & Record<string, any> : Record<string, any>

const noop: (...args: any[]) => void = () => {}

interface ModalProps extends Partial<DialogProps> {
  footerAlign?: 'left' | 'center' | 'right'
  onClosed?: () => void
}

/**
 * 命令式弹框
 * @param component
 * @param props
 * @param modalProps
 */
export function renderDialog<T extends Component>(
  component: T,
  props: ComponentProps<T> = {} as ComponentProps<T>,
  modalProps: ModalProps = {},
) {
  const modelValue = ref(true)
  const instance = ref()
  const loading = ref(false)

  // 保存 resolve 和 reject 方法
  let resolve = noop
  let reject = noop

  // 如果用户调用过 catch，则调用 reject，因为可能用户在 catch 中处理了一些逻辑
  let callReject = false
  /**
   * 弹框关闭时调用，默认会在用户调用过 catch 后调用 reject 方法
   * 如果用户点击确认，提交成功后，handler = resolve 方法，调用时会执行 resolve 方法
   */
  let handler = () => {
    if (callReject)
      reject()
  }

  /**
   * 点击确认时调用
   */
  function handleOk() {
    /**
     * 调用子组件 的 submit 方法，支持返回 Promise
     */
    const res = instance.value?.submit?.()
    if (res instanceof Promise) {
      /**
       * 如果是 Promise，等待 Promise 结果
       */
      loading.value = true
      res.then(() => {
        // 提交成功，关闭弹框
        close()
        handler = resolve
      }).finally(() => {
        // 关闭 loading
        loading.value = false
      })
    }
    else {
      /**
       * 不是 Promise，直接关闭弹框
       */
      close()
      handler = resolve
    }
  }

  /**
   * 函数式组件
   * ElConfigProvider 国际化中文
   * ElDialog 弹框组件
   *  default 插槽渲染传入的组件
   *  footer 插槽渲染确认和取消按钮
   */
  const dialog = () => h(ElConfigProvider, { locale: zhCn }, () => h(ElDialog, {
    ...modalProps,
    modelValue: modelValue.value,
    onClosed() {
      // 弹框关闭后调用 handler 方法，处理 Promise 状态
      handler()
      // 调用用户传入的 onClosed 方法
      modalProps.onClosed?.()
      // 卸载 app
      unmount()
    },
  }, {
    default: () => h(component, { ...props, ref: instance }),
    footer: () => h('div', {
      style: { textAlign: modalProps.footerAlign || 'right' },
    }, [
      h(ElButton, { type: 'primary', loading: loading.value, onClick: handleOk }, () => '确认'),
      h(ElButton, {
        onClick: close,
      }, () => '取消'),
    ]),
  }))

  /**
   * 创建容器用于挂载弹框
   */
  const container = document.createElement('div')
  document.body.appendChild(container)

  /**
   * 创建 app
   */
  const app = createApp(dialog)
  /**
   * 继承上层 app 的配置
   */
  extendsApp(app)
  app.mount(container)

  /**
   * 卸载 App
   */
  function unmount() {
    app.unmount()
    document.body.removeChild(container)
  }

  /**
   * 调用 close 方法会关闭弹框
   */
  function close() {
    modelValue.value = false
  }

  const promise = new Promise<true>((_resolve, _reject) => {
    resolve = _resolve.bind(null, true)
    reject = _reject
  })

  close.finally = promise.finally.bind(promise)

  close.then = promise.then.bind(promise)

  close.catch = (_onRejected) => {
    callReject = true
    return promise.catch(_onRejected)
  }

  /**
   * close 是一个函数，同时也是一个 PromiseLike，意味着它可以被当做函数调用
   * 也可以被当做 Promise 使用，注意这个是一个 PromiseLike，并非 ES6 的 Promise，不过它也可以被 await
   */
  return close as typeof promise & (() => void)
}
```