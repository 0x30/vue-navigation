import { defineAsyncComponent } from "vue";
import { push } from "./core";

export const toDetail = (id: number) => {
  const Component = defineAsyncComponent(() => import("./views/detail"));
  push(<Component id={id} />);
};

export const useConfirm = () => {
  return new Promise<boolean>((resolve) => {
    const Component = defineAsyncComponent(() => import("./views/confirm"));
    push(<Component onResult={resolve} />);
  });
};
