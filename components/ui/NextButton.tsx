import clsx from "clsx";
export default function NextButton({
  disabled,
  children = "Next",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={clsx(
        disabled
          ? "btn bg-neutral-300 text-neutral-600 cursor-not-allowed shadow-none opacity-100"
          : "btn btn-signup"
      )}
    >
      {children}
    </button>
  );
}
