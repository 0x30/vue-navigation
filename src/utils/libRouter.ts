import { RouteLocationRaw, Router } from "vue-router";

export enum NavigationDirection {
  back = "back",
  forward = "forward",
  replace = "replace",
  unknown = "unknow",
}

declare interface NavigationCallback {
  (
    to: string,
    from: string,
    direction: NavigationDirection,
    delta: number
  ): void;
}

const hooks: Set<NavigationCallback> = new Set<NavigationCallback>();

export let currentDelta = 0;
export let currentDirection: NavigationDirection = NavigationDirection.unknown;

const exec = (
  to: string,
  from: string,
  direction: NavigationDirection,
  delta: number
) => {
  currentDelta = delta;
  currentDirection = direction;
  hooks.forEach((hook) => hook(to, from, direction, delta));
};

export const useRouterListen = (
  router: Router,
  callback: NavigationCallback | undefined = undefined
) => {
  callback && hooks.add(callback);

  if ((router as any)._0x30_navigation_listened === false) {
    (router as any)._0x30_navigation_listened = true;

    router.options.history.listen((to, from, info) => {
      exec(to, from, info.direction, info.delta);
    });

    const _p = router.push;
    router.push = function (to: RouteLocationRaw) {
      if (typeof to === "string") to = { path: to };

      exec(
        (to as { path: string }).path,
        this.currentRoute.value.path,
        NavigationDirection.forward,
        1
      );

      return _p.call(this, to).catch(() => {
        //
      });
    };

    const _r = router.replace;
    router.replace = function (to: RouteLocationRaw) {
      if (typeof to === "string") to = { path: to };

      exec(
        (to as { path: string }).path,
        this.currentRoute.value.path,
        NavigationDirection.replace,
        1
      );

      return _r.call(this, to).catch(() => {
        //
      });
    };
  }

  return () => {
    callback && hooks.delete(callback);
  };
};
