import { defineComponent, ref } from "vue";
import { toDetail } from "./routers";
import { usePageMate } from "@0x30/vue-navigation";

const Page = defineComponent({
  name: "PageDetail",
  props: {
    id: String,
  },
  setup: () => {
    const count = ref(0);

    usePageMate({
      id: "home",
      name: "首页列表",
    });

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
