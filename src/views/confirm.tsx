import anime from "animejs";
import { defineComponent, PropType } from "vue";
import { back, useTransitionEnter, useTransitionLeave } from "../core";

const Page = defineComponent({
  name: "PageDetail",
  props: {
    onResult: Function as PropType<(res: boolean) => void>,
  },
  setup: (props) => {
    const cancel = () => {
      back();
    };

    useTransitionEnter((el, done) => {
      anime({
        targets: el,
        translateY: ["100%", "0"],
        duration: 800,
        complete: done,
      });
    });

    useTransitionLeave((el, done) => {
      anime({
        targets: el,
        translateY: ["0", "100%"],
        duration: 800,
        complete: done,
      });
    });

    const click = async (res: boolean) => {
      await back();
      props.onResult?.(res);
    };

    return () => (
      <div
        class="page"
        style={{
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
        }}
      >
        <div style={{ padding: "100px 0", background: "red" }}>
          <button onClick={() => click(true)}>ok</button>
          <button onClick={() => click(false)}>no</button>
        </div>
      </div>
    );
  },
});

export default Page;