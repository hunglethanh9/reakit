import { ButtonOptions, ButtonHTMLProps, useButton } from "../Button/Button";
import { unstable_useOptions } from "../system/useOptions";
import { unstable_useProps } from "../system/useProps";
import { unstable_createComponent } from "../utils/createComponent";
import { unstable_mergeProps } from "../utils/mergeProps";
import { As, PropsWithAs, Keys } from "../__utils/types";
import { unstable_FormStateReturn, unstable_useFormState } from "./FormState";
import { getInputId } from "./__utils/getInputId";
import { getPushButtonId } from "./__utils/getPushButtonId";
import { DeepPath } from "./__utils/types";

export type unstable_FormRemoveButtonOptions<
  V,
  P extends DeepPath<V, P>
> = ButtonOptions &
  Pick<unstable_FormStateReturn<V>, "baseId" | "values" | "remove"> & {
    /**
     * FormInput's name as in form values. This should point to array value.
     */
    name: P;
    /**
     * The index in `form.values[name]` that will be removed.
     */
    index: number;
  };

export type unstable_FormRemoveButtonHTMLProps = ButtonHTMLProps;

export type unstable_FormRemoveButtonProps<
  V,
  P extends DeepPath<V, P>
> = unstable_FormRemoveButtonOptions<V, P> & unstable_FormRemoveButtonHTMLProps;

export function unstable_useFormRemoveButton<V, P extends DeepPath<V, P>>(
  options: unstable_FormRemoveButtonOptions<V, P>,
  htmlProps: unstable_FormRemoveButtonHTMLProps = {}
) {
  options = unstable_useOptions("FormRemoveButton", options, htmlProps);

  htmlProps = unstable_mergeProps(
    {
      onClick: () => {
        options.remove(options.name, options.index);

        const inputId = getInputId(options.name, options.baseId);
        if (!inputId) return;

        window.requestAnimationFrame(() => {
          const selector = `[id^="${inputId}-"]`;
          const inputs = document.querySelectorAll<HTMLInputElement>(selector);

          if (inputs.length) {
            const inputsArray = Array.from(inputs);
            const nextIdx = inputsArray.reduce((final, input) => {
              const match = input.id.match(new RegExp(`${inputId}-([0-9]+)`));
              if (!match) return final;
              const [, idx] = match;
              if (Number(idx) > final && options.index >= final) {
                return Number(idx);
              }
              return final;
            }, 0);
            const nextSelector = `[id^="${inputId}-${nextIdx}"]`;
            const input = document.querySelector<HTMLInputElement>(
              nextSelector
            );
            if (input) {
              input.focus();
              return;
            }
          }
          const pushButtonId = getPushButtonId(options.name, options.baseId);
          if (pushButtonId) {
            const pushButton = document.getElementById(pushButtonId);
            if (pushButton) {
              pushButton.focus();
            }
          }
        });
      }
    } as unstable_FormRemoveButtonHTMLProps,
    htmlProps
  );

  htmlProps = unstable_useProps("FormRemoveButton", options, htmlProps);
  htmlProps = useButton(options, htmlProps);
  return htmlProps;
}

const keys: Keys<
  unstable_FormStateReturn<any> & unstable_FormRemoveButtonOptions<any, any>
> = [...useButton.__keys, ...unstable_useFormState.__keys, "name", "index"];

unstable_useFormRemoveButton.__keys = keys;

export const unstable_FormRemoveButton = (unstable_createComponent({
  as: "button",
  useHook: unstable_useFormRemoveButton
}) as unknown) as <V, P extends DeepPath<V, P>, T extends As = "button">(
  props: PropsWithAs<unstable_FormRemoveButtonOptions<V, P>, T>
) => JSX.Element;
