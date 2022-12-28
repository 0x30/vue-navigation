import { defineAsyncComponent, defineComponent, ref } from "vue";
import { push } from "./core";

const Page = defineComponent({
  name: "PageDetail",
  props: {
    id: String,
  },
  setup: (props) => {
    const toDetail = (id: number) => {
      const Detail = defineAsyncComponent(() => import("./views/detail"));
      push(<Detail id={id} />);
    };

    const count = ref(0);

    return () => (
      <div class="page">
        <button onClick={() => count.value++}>{count.value}</button>

        {new Array(10).fill(1).map((v, i) => (
          <div key={i} onClick={() => toDetail(i)}>
            id - {i}
          </div>
        ))}
      </div>
    );
  },
});

export default Page;
