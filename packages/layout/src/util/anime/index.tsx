import {
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
} from "./easing";

const easing = {
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
};

/**
 * 动画执行方法
 * @param start 开始值
 * @param end 结束值
 * @param duration 动画执行时间 ms
 * @param method 动画方法
 * @param callback 每一帧值的回调
 * @returns
 */
function animate(
  start: number,
  end: number,
  duration: number,
  method: keyof typeof easing,
  callback: (value: number) => void
) {
  return new Promise<void>((resolve) => {
    const startTime = Date.now();
    const delta = end - start;

    let rafId: number | undefined;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const value = easing[method](elapsed, start, delta, duration);

      callback(value);
      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = undefined;
        resolve();
      }
    };
    tick();
  });
}

export { animate };
