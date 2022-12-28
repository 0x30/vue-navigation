import anime from "animejs";
import { defineComponent } from "vue";
import {
  back,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionLeave,
} from "../core";
import { useConfirm } from "../routers";

const Page = defineComponent({
  name: "PageDetail",
  props: {
    id: Number,
  },
  setup: (props) => {
    const cancel = () => {
      back();
    };

    useLeaveBefore(() => {
      return useConfirm();
    });

    useTransitionEnter((el, done) => {
      anime({
        targets: el,
        translateX: ["100%", "0"],
        duration: 800,
        complete: done,
      });
    });

    useTransitionLeave((el, done) => {
      anime({
        targets: el,
        translateX: ["0", "100%"],
        duration: 800,
        complete: done,
      });
    });

    return () => (
      <div class="page">
        <button onClick={cancel}>cancel</button>
        <div>id: {props.id}</div>
      </div>
    );
  },
});

export default Page;
