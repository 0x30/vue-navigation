import {
  callWithAsyncErrorHandling,
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  isVNode,
  onBeforeUnmount,
  queuePostFlushCb,
  RendererElement,
  RendererNode,
  SuspenseBoundary,
  VNode
} from "vue";
import { isArray, invokeArrayFns } from "@vue/shared";
import {
  currentDelta,
  currentDirection,
  NavigationDirection,
  useRouterListen
} from "../utils/libRouter";
import { useRouter } from "vue-router";

type KeepAliveContext = {
  renderer: any;
  activate: (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    isSVG: boolean,
    optimized: boolean
  ) => void;
  deactivate: (vnode: VNode) => void;
};

function queueEffectWithSuspense(
  fn: Function | Function[],
  suspense: SuspenseBoundary | null
): void {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}

function invokeVNodeHook(
  hook: any,
  instance: ComponentInternalInstance | null,
  vnode: VNode,
  prevVNode: VNode | null = null
) {
  callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}

function resetShapeFlag(vnode: VNode) {
  let shapeFlag = vnode.shapeFlag;
  if (shapeFlag & 256) {
    shapeFlag -= 256;
  }
  if (shapeFlag & 512) {
    shapeFlag -= 512;
  }
  vnode.shapeFlag = shapeFlag;
}

function getInnerChild(vnode: VNode) {
  return vnode.shapeFlag & 128 ? vnode.ssContent! : vnode;
}

export const Navigation = defineComponent({
  name: "KeepAlive",
  inheritRef: true,
  __isKeepAlive: true,
  setup: (_, { slots }) => {
    useRouterListen(useRouter());

    const stacks: VNode[] = [];

    const instance = getCurrentInstance()! as any;
    const parentSuspense = instance.suspense;

    // KeepAlive communicates with the instantiated renderer via the
    // ctx where the renderer passes in its internals,
    // and the KeepAlive instance exposes activate/deactivate implementations.
    // The whole point of this is to avoid importing KeepAlive directly in the
    // renderer to facilitate tree-shaking.
    const sharedContext = instance.ctx as KeepAliveContext;
    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement }
      }
    } = sharedContext;
    const storageContainer = createElement("div");

    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance = vnode.component as ComponentInternalInstance;
      move(vnode, container, anchor, 0, parentSuspense);
      // in case props have changed
      patch(
        instance.vnode,
        vnode,
        container,
        anchor,
        instance,
        parentSuspense,
        isSVG,
        optimized
      );

      queueEffectWithSuspense(() => {
        instance.isDeactivated = false;
        if ((instance as any).a) {
          invokeArrayFns((instance as any).a);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
      }, parentSuspense);
    };

    sharedContext.deactivate = (vnode: VNode) => {
      const instance = vnode.component! as any;
      move(vnode, storageContainer, null, 1, parentSuspense);
      queueEffectWithSuspense(() => {
        if ((instance as any).da) {
          invokeArrayFns((instance as any).da);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode);
        }
        instance.isDeactivated = true;
      }, parentSuspense);
    };

    function unmount(vnode: VNode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode);
      _unmount(vnode, instance, parentSuspense);
    }

    onBeforeUnmount(() => {
      stacks.forEach(cached => {
        const { subTree, suspense } = instance;
        const vnode = getInnerChild(subTree);
        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode);
          // but invoke its deactivated hook here
          const da = (vnode.component as any).da;
          da && queueEffectWithSuspense(da, suspense);
          return;
        }
        unmount(cached);
      });
    });

    return () => {
      if (!slots.default) {
        return null;
      }

      const children = slots.default();
      const rawVNode = children[0];
      if (children.length > 1) {
        return children;
      } else if (
        !isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128))
      ) {
        return rawVNode;
      }

      const vnode = getInnerChild(rawVNode);

      if (
        currentDirection === NavigationDirection.back ||
        currentDirection === NavigationDirection.replace
      ) {
        for (let index = 0; index < Math.abs(currentDelta); index++) {
          const comp = stacks.pop();
          comp && unmount(comp);
        }
      }

      if (currentDirection === NavigationDirection.back) {
        const component = stacks[stacks.length - 1];
        if (component) component.shapeFlag |= 512;
        else {
          /// 在 a 前进至 b,但是在 b 刷新了页面后
          /// 返回 a 时，需要将 a 重新导入 一分
          vnode.shapeFlag |= 256;
          stacks.push(vnode);
        }
      } else if (
        currentDirection === NavigationDirection.unknown ||
        currentDirection === NavigationDirection.forward ||
        currentDirection === NavigationDirection.replace
      ) {
        vnode.shapeFlag |= 256;
        stacks.push(vnode);
      }

      return stacks[stacks.length - 1] || vnode;
    };
  }
});
