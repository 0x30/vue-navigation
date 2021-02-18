import { RouteLocationRaw, Router } from "vue-router";

export const enum NavigationDirection {
  back = "back",
  forward = "forward",
  replace = "replace",
  unknown = ""
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
  hooks.forEach(hook => hook(to, from, direction, delta));
};

export const useRouterListen = (
  router: Router,
  callback: NavigationCallback | undefined = undefined
) => {
  callback && hooks.add(callback);

  if ((router as any).___0x30_navigation_listened === undefined) {
    (router as any).___0x30_navigation_listened = 0;

    router.options.history.listen((to, from, info) => {
      exec(
        to,
        from,
        (info.direction as string) as NavigationDirection,
        info.delta
      );
    });

    const _p = router.push;
    router.push = function(to: RouteLocationRaw) {
      if (typeof to === "string") to = { path: to };

      exec(
        (to as { path: string }).path,
        this.currentRoute.value.path,
        NavigationDirection.forward,
        1
      );

      return _p.call(this, to);
    };

    const _r = router.replace;
    router.replace = function(to: RouteLocationRaw) {
      if (typeof to === "string") to = { path: to };

      exec(
        (to as { path: string }).path,
        this.currentRoute.value.path,
        NavigationDirection.replace,
        1
      );

      return _r.call(this, to);
    };
  }

  return () => {
    callback && hooks.delete(callback);
  };
};
