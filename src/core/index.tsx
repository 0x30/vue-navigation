import {
  type App,
  type Component,
  createApp,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  Transition,
  type AppContext,
  defineComponent,
  onUnmounted,
} from "vue";

const randomId = () => `_${Math.random().toString(32).slice(2)}`;

/// 当前的 session Id,用于刷新页面后判断是否当前会话
const currentSessionId = randomId();

/**
 * hook 方法
 * onEnter 存储 transitionEnter hook 方法
 * onLeave 存储 transitionLeave hook 方法
 * close 存储 close 关闭方法
 */
enum ExtensionHooks {
  onEnter = "_oe",
  onLeave = "_ol",
  close = "_c",
  onLeaveBefore = "_olb",
  onActivated = "_oa",
  onDeactivated = "_oda",
  cancelBatchId = "_cbi",
}

const setValueToAppContext = (
  target: AppContext | undefined,
  type: ExtensionHooks,
  hook: any
) => {
  if (target) {
    (target as any)[type] = hook;
  }
};

const addValueToAppContext = (
  target: AppContext | undefined,
  type: ExtensionHooks,
  hook: Function | undefined
) => {
  if (target) {
    const hooks = (target as any)[type] ?? [];
    (target as any)[type] = [...hooks, hook];
  }
};

const getValueFromAppContext = <T extends any>(
  target: AppContext | undefined,
  type: ExtensionHooks
) => {
  if (target) {
    return (target as any)[type] as T;
  }
  return undefined;
};

/**
 * 在页面在返回,提供一个方法,向用户询问
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
export const useLeaveBefore = (hook: () => boolean | Promise<boolean>) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeaveBefore,
    hook
  );
};

export type TransitionAmimatorHook = (
  elements: {
    from?: Element;
    to?: Element;
  },
  done: () => void
) => void;

/**
 * 在页面进入时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
export const useTransitionEnter = (hook: TransitionAmimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onEnter,
    hook
  );
};

/**
 * 在页面离开时设置 动画执行方法
 * 请保证该方法只被注册一次,多次注册将覆盖
 */
export const useTransitionLeave = (hook: TransitionAmimatorHook) => {
  setValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onLeave,
    hook
  );
};

/**
 * use activeated 活跃的时候 hook
 */
export const useActivated = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onActivated,
    hook
  );
};

/**
 * use activeated 非活跃的时候 hook
 */
export const useDeactivated = (hook: () => void) => {
  addValueToAppContext(
    getCurrentInstance()?.appContext,
    ExtensionHooks.onDeactivated,
    hook
  );
};

/**
 * 路由堆栈,存储 app stacks
 */
const routerStack: App[] = [];
(window as any).routerStack = routerStack;
// 当前的 state
let currentState: any = undefined;

const getLastApp = () => routerStack[routerStack.length - 1];

/**
 * 返回页面判断
 *
 * 获取当前的 app 实例, 判断当前的 实例,是否存在 leaveBefore
 * 1. 如果不存在,则直接返回
 * 2. 如果存在,则处理 leaveBefore 的结果
 *  1. 如果 leaveBefore 的结果直接是 true false,则继续处理
 *  2. 如果是 promise, 则等待结果,等待结果期间,为了防止多次触发返回,提前恢复状态
 *
 * @param instance 对象实例
 * @param batchId 批次id 可能存在多次返回的情况,用于区分批次
 * @param deltaCount 页面返回个数
 * @returns
 */
const backCheck = (deltaCount: number) => {
  const app = getLastApp();
  const instance = app?._context;

  // local id 保存
  const batchId = randomId();
  setValueToAppContext(instance, ExtensionHooks.cancelBatchId, batchId);

  const hook = getValueFromAppContext<Function>(
    instance,
    ExtensionHooks.onLeaveBefore
  );

  if (hook === undefined) return undefined;

  /// 为了防止多次返回 提前返回
  const { index, session } = currentState;
  const start = index - deltaCount + 1;
  for (let i = 0; i < deltaCount; i++) {
    currentState = { index: start + i, session };
    window.history.pushState(currentState, "");
  }

  return new Promise<void>(async (resolve) => {
    const _resolve = () => {
      setValueToAppContext(instance, ExtensionHooks.onLeaveBefore, undefined);
      window.history.go(-deltaCount);
      resolve();
    };

    const result = hook();
    if (result instanceof Promise || typeof result["then"] === "function") {
      if (
        (await result) === true &&
        getValueFromAppContext<string>(
          instance,
          ExtensionHooks.cancelBatchId
        ) === batchId
      )
        _resolve();
    } else {
      if (
        result &&
        getValueFromAppContext<string>(
          instance,
          ExtensionHooks.cancelBatchId
        ) === batchId
      )
        _resolve();
    }
  });
};

const unmounted = (needAnimated: boolean, app?: App, backHookId?: string) => {
  if (app === undefined) return;

  const _unmounted = () => {
    app.unmount();
    if (app._container instanceof Element) {
      app._container.parentElement?.removeChild(app._container);
    }
  };

  /// 只有 最顶层的 一个需要执行动画
  if (needAnimated) {
    getValueFromAppContext<Function>(app._context, ExtensionHooks.close)?.apply(
      null,
      [
        () => {
          _unmounted();

          /// tigger activated hooks
          getValueFromAppContext<Function[]>(
            getLastApp()?._context,
            ExtensionHooks.onActivated
          )?.forEach((func) => func.apply?.(null));

          /// 如果存在 id,则触发
          if (backHookId) backHooks[backHookId]?.apply(null);
        },
      ]
    );
  } else {
    _unmounted();
  }
};

const mounted = (compoent: Component, replace: boolean) => {
  return new Promise<void>((resolve) => {
    // 创建 container
    const container = document.createElement("div");
    document.body.appendChild(container);

    /// 在页面 replace 动画执行完成后 unmounted 倒数第二个 app
    let replaceDone = () => {
      if (replace === false) return;
      unmounted(false, routerStack.splice(routerStack.length - 2, 1)[0]);
    };

    // 创建 app
    const app = createApp({
      setup: () => {
        const isShow = ref(true);
        /// 关闭方法,在动画执行完成后 调用 销毁 app
        let closeDone: Function | undefined = undefined;

        /// 暂存 target , 由于 transtion onEnter 和 onLeave 获取不到 instance
        let target = getCurrentInstance();
        onMounted(() => {
          target = getCurrentInstance();
          setValueToAppContext(
            target?.appContext,
            ExtensionHooks.close,
            (done: Function) => {
              closeDone = done;
              isShow.value = false;
            }
          );
        });

        return () => (
          <Transition
            appear
            onEnter={async (el, done) => {
              await nextTick();

              const _done = () => {
                done();
                replaceDone();
                resolve();
              };

              const hook = getValueFromAppContext<TransitionAmimatorHook>(
                target?.appContext,
                ExtensionHooks.onEnter
              );
              if (hook)
                hook?.apply(null, [
                  {
                    from: routerStack[routerStack.length - 2]?._container,
                    to: el,
                  },
                  _done,
                ]);
              else _done();
            }}
            onLeave={(el, done) => {
              const _done = async () => {
                done();
                await nextTick();
                closeDone?.();
              };
              const hook = getValueFromAppContext<TransitionAmimatorHook>(
                target?.appContext,
                ExtensionHooks.onLeave
              );

              if (hook)
                hook?.apply(null, [
                  {
                    from: el,
                    to: routerStack[routerStack.length - 1]?._container,
                  },
                  _done,
                ]);
              else _done();
            }}
          >
            {isShow.value ? compoent : null}
          </Transition>
        );
      },
    });
    app.mount(container);

    if (replace === false) {
      // 维护 history state
      currentState = { index: routerStack.length, session: currentSessionId };
      window.history.pushState(currentState, "");
    }

    /// tigger activated hooks
    getValueFromAppContext<Function[]>(
      getLastApp()?._context,
      ExtensionHooks.onDeactivated
    )?.forEach((func) => func.apply?.(null));

    // push 方法滞后,保持 index
    routerStack.push(app);
  });
};

/**
 * 前进方法
 *
 * ```tsx
 * import Component from "./component"
 *
 * push(<Component prop1={1} />)
 * ```
 *
 * 异步加载组件使用 vue 自带的 `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * push(<Component prop1={1} />);
 * ```
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionEnter` 设置页面动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param component 组件
 */
export const push = (component: Component) => {
  return mounted(component, false);
};

/**
 * 替换方法
 *
 * ```tsx
 * import Component from "./component"
 *
 * replace(<Component prop1={1} />)
 * ```
 *
 * 异步加载组件使用 vue 自带的 `defineAsyncComponent`
 *
 * ```tsx
 * const Component = defineAsyncComponent(() => import("./component"));
 * replace(<Component prop1={1} />);
 * ```
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionEnter` 设置页面动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param component 组件
 */
export const replace = (component: Component) => {
  return mounted(component, true);
};

let backHooks: Record<string, Function> = {};
let lastBackHookId: string | undefined = undefined;

/**
 * 返回当前最顶部页面方法
 *
 * 方法返回 `Promise<void>`, 在页面完成跳转后 `promise.reslove`
 *
 * 组件可以通过设置 `useTransitionLeave` 设置页面离开动画,如果设置动画则会在动画执行完成后, `promise.reslove`
 *
 * @param delta 返回次数 uint
 */
export const back = (delta: number = 1) => {
  return new Promise<void>((resolve) => {
    lastBackHookId = randomId();

    backHooks = {
      [lastBackHookId]: () => {
        lastBackHookId = undefined;
        resolve();
      },
    };
    window.history.go(-Math.abs(delta));
  });
};

const listenPopState = (app: App) => {
  routerStack.push(app);
  currentState = { index: 0, session: currentSessionId };
  window.history.pushState(currentState, "");

  const handler = async (event: PopStateEvent) => {
    if (!currentState) return;

    /// 获取最后一个 backHookId
    const localLastBackHookId = lastBackHookId;

    let diffValue = 0;

    if (
      // 如果 event.state is null,则说明 返回到了 没有状态的 页面了,则说明是 返回到顶层了
      event.state === null ||
      // 如果 session 和 当前 state session 不一样了,则说明 是在页面 刷新了
      event.state.session !== currentState.session
    ) {
      diffValue = -(currentState.index + 1);
    } else {
      diffValue = event.state.index - currentState.index;
    }

    if (diffValue === 0) return;
    /// 前进处理
    if (diffValue >= 1) {
      window.history.go(-diffValue);
      return;
    }

    /// 检查 是否可以返回
    await backCheck(-diffValue);

    /// 销毁 组件
    routerStack
      .splice(currentState.index + diffValue + 1)
      .forEach((app, index, array) =>
        unmounted(index === array.length - 1, app, localLastBackHookId)
      );

    if (routerStack.length === 0) currentState = undefined;
    else currentState = window.history.state;
  };

  return {
    add: () => window.addEventListener("popstate", handler),
    remove: () => window.removeEventListener("popstate", handler),
  };
};

export const Navigator = defineComponent({
  name: "NavigatorController",
  setup: (props, { slots }) => {
    const { add, remove } = listenPopState(
      getCurrentInstance()!.appContext.app
    );
    onMounted(add);
    onUnmounted(remove);
    return () => slots.default?.();
  },
});

/**
 * 示例
````ts
import { createApp } from 'vue'

const app = createApp({
  // ...
})

app.use(navigation())
````

在 app,创建后 use 开始启用 该插件
 */
export const navigation = () => {
  return {
    install(app: App) {
      const { add } = listenPopState(app);
      add();
    },
  };
};
