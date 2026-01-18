# build-file-tree 开发笔记

[仓库地址](https://github.com/SilverAkatoki/build-file-tree)

## 事件挂载与 DOM

众所周知，`onMounted` 钩子会在 DOM 渲染完成后才调用里面的函数。
根据惯例，`addEventListener` 会放在 `onMounted` 内，`removeEventListener` 会放在 `onUnmounted` 内：

```ts
onMounted(() => {
  // 一个简单的界面点击事件做样例
  window.addEventListener("keydown", handler);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handler);
});
```

如果要访问 DOM 元素，放在外面（即 `setup` 顶层作用域）会因为 DOM 没渲染完（ `setup` 顶层作用域内的代码在组件实例创建时执行）所以里面的 DOM 引用 / `querySelector` 会返回空值。

另外，原生的事件监听器是不会被 Vue 主动移除的。
如果是挂载在 `window`，`document` 这些全局对象中，事件处理函数的生命周期贯穿整个标签页的始终，组件卸载后函数还在内存当中。反复加载卸载组件，这些函数就会堆起来让内存泄漏。
`onUnmounted` 内的 `removeEventListener` 则起到了在关闭渲染时释放内存的作用。

现在更推荐使用组合式函数把这个过程自动封装，比如 VueUse 里的 [useEventListener](https://vueuse.org/core/useEventListener/)

如果不介意 `any` 的话，这里有个丐版可以用：

```ts
import { onMounted, onUnmounted } from "vue";

export const useEventListener = (target: any, event: any, callback: any) => {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

## 依赖注入

在这里这种层级不定的递归嵌套场景下，很难用 `props` / `emits` 那一套在父子组件中传递消息。

> 参考：[依赖注入](https://cn.vuejs.org/guide/components/provide-inject)

这就是传说中的依赖注入了，也就是 `provide` / `inject`。完整的使用指南还是建议读读官方文档。简单来说：

- 发送信息的组件（父组件）

  ```ts
  import { provide } from "vue";

  const foo = ref<string>("foo");
  const bar = (s: string) => (foo.value = s);

  provide("baz", {foo, bar});
  ```

- 接收信息的组件（子组件）

  ```ts
  import { inject } from "vue";

  const { foo, bar } = inject("baz") as any;

  // 拿到新的数据用
  ```

注意它只能沿着组件树由父组件到子组件单向传递，而不能子传父。

注意到那个丑陋的 `any` 没有，这里有个标注类型的方法。

> 参考：[为 provide / inject 标注类型](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-provide-inject)

我嫌文档说的太难懂了，这里有个更简单的例子，就是给上面那两个做的标注：

- 类型定义

  ```ts
  import type { InjectionKey, Ref } from "vue";

  interface BazContext {
    foo: Ref<string>;
    bar: (s: string) => void;
  }

  export const bazKey: InjectionKey<BazContext> = Symbol("baz");
  ```

- 发送信息的组件（父组件）

  ```ts
  // ...
  provide(bazKey, { foo, bar });
  ```

- 接收信息的组件（子组件）

  ```ts
  const context = inject(bazKey);

  // 出来的可能是 null，所以必须加检查，要不就感叹号无视了呗
  if (!context) {
    throw Error("注入失败");
  }

  const { foo, bar } = context;
  ```

## `await nextTick()`

用来等待这轮 Vue 渲染完 DOM 的语句。

有时候明明代码里修改了响应式变量，但紧接着去获取 DOM 元素的属性（比如高度、宽度或内容）时，拿到的还是旧的数据。
这种情况是因为 Vue 的 DOM 更新是异步的。
修改状态时，Vue 会开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同步执行代码，此时 DOM 还没来得及重新渲染，所以看到的是错误的信息。

举个例子：假设我们有一个列表，点击按钮添加一项后，想要立刻滚动到列表底部。

```ts
import { ref, nextTick } from "vue";

const list = ref(["第一项", "第二项"]);
const listRef = ref<HTMLElement | null>(null);

const addItem = async () => {
  list.value.push("新加项");

  // 如果直接执行，listRef 的高度还是增加前的，滚动位置会出错
  // listRef.value.scrollTop = listRef.value.scrollHeight; 

  // 等待 Vue 完成这一轮 DOM 更新
  await nextTick();

  // 此时 DOM 已经变了，能拿到最新的高度
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight;
  }
};
```

## 点击元素内部

经常需要看某个点击事件是不是点在了一个 DOM 里面。

```ts
const handleClick = (e: MouseEvent) => {
  const isClickInside = (e.target as HTMLElement).closest(".foo");

  // ...
};
```

`cloest` 检查点击的元素及其父 DOM 中，是否包含指定的那个 DOM（这里是含有 `foo` 类的 DOM）

## Tailwind CSS

足以为其单开一章，但说实话没啥说的。
本质就把一些常用的属性组合成类名，这样就只用写模板而不用上下滑 CSS 了。

比如：

- before

  ```html
  <template>
    <div class="container">
      <!-- ... -->
    </div>
  </template>

  <style lang="css">
  .container {
    display: flex;
    flex-direction: row;
  }
  </style>
  ```

- after

  ```html
  <template>
    <div class="flex flex-row">
      <!-- ... -->
    </div>
  </template>
  ```

有 CSS 属性不知道怎么转写成原子类就去查文档，比如 Tailwind CSS 自己的和样式库的。

> 参考：[Tailwind CSS 入门](https://www.tailwindcss.cn/docs/installation)
