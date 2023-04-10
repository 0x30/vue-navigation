import anime from "animejs";
import { defineComponent, ref } from "vue";
import {
  back,
  useLeaveBefore,
  useTransitionEnter,
  useTransitionEnterFinish,
  useTransitionLeave,
  useTransitionLeaveFinish,
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

    useTransitionEnterFinish(() => {
      console.log("页面执行完毕");
    });

    useTransitionLeaveFinish(() => {
      console.log("页面离开完毕");
    });

    useLeaveBefore(() => {
      return useConfirm();
    });

    useTransitionEnter((el, done) => {
      anime({
        targets: el.from,
        translateX: ["0", "-50%"],
        duration: 1000,
      });
      anime({
        targets: el.to,
        translateX: ["100%", "0"],
        duration: 1000,
        complete: done,
      });
    });

    useTransitionLeave((el, done) => {
      anime({
        targets: el.to,
        translateX: ["-50%", "0%"],
        duration: 1000,
      });
      anime({
        targets: el.from,
        translateX: ["0", "100%"],
        duration: 1000,
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
