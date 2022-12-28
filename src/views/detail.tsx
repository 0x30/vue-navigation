import anime from "animejs";
import { defineComponent, ref } from "vue";
import {
  back,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionLeave,
} from "../core";
import { replaceDetail, toDetail, useConfirm } from "../routers";

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

    const count = ref(0);

    return () => (
      <div class="page">
        <button onClick={cancel}>cancel</button>
        <div>id: {props.id}</div>

        <button onClick={() => count.value++}>count: {count.value}</button>

        <h2>list</h2>
        {new Array(10).fill(1).map((v, i) => (
          <div key={i}>
            <button onClick={() => toDetail(i)}>push</button>
            <button onClick={() => replaceDetail(i)}>replace</button>
            id - {i}
          </div>
        ))}
      </div>
    );
  },
});

export default Page;
