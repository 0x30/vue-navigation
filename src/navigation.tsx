import {
  App,
  Component,
  ComponentInternalInstance,
  createApp,
  createVNode,
  defineAsyncComponent,
  DefineComponent,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onActivated,
  onMounted,
  ref,
  Transition,
} from "vue";

import anime from "animejs";
import {
  useActivated,
  useDeactivated,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionLeave,
  push as _p,
  back,
} from "./core";

type NavigationComponent = Component | DefineComponent;
type Lazy<T> = () => Promise<T>;

interface NavigationConfig {
  [key: string]: NavigationComponent | Lazy<NavigationComponent>;
}

interface HistoryState {
  index: number;
}

const SUBA = defineComponent(() => {
  useActivated(() => {
    console.log("SUBA Activeted");
  });

  useDeactivated(() => {
    console.log("SUBA deactived");
  });
  return () => <div>.</div>;
});

const A = defineComponent({
  props: {
    name: String,
  },
  setup: (props) => {
    useActivated(() => {
      console.log("a actived");
    });

    useDeactivated(() => {
      console.log("a deactived");
    });

    useTransitionEnter((el, done) => {
      anime({
        targets: el,
        rotate: "1turn",
        duration: 800,
        complete() {
          done();
        },
      });
    });

    useTransitionLeave((el, done) => {
      console.log(el, done);

      anime({
        targets: el,
        rotate: "1.3turn",
        duration: 800,
        complete() {
          done();
        },
      });
    });

    useLeaveBefore(() => {
      return window.confirm("是否放回");
    });

    return () => (
      <div
        style={{ background: "red" }}
        onClick={async () => {
          await back();
          console.log("页面返回完毕");
        }}
      >
        A<SUBA />
      </div>
    );
  },
});
const B = defineComponent(() => () => <div>B</div>);
const routers = { a: A, b: B };

export const push = (key: "a" | "b") => {
  _p(<A />);
};
