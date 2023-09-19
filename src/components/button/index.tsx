import { cn } from "../../utils/cn";

const Button: React.FunctionComponent<ButtonProps> = ({ className, variant = "Solid", leadingIcon = false, ...props }) => {
  return (
    <button
      className={cn("flex flex-row border items-center justify-center font-medium gap-2 hover:gap-2.5 transition-all px-4 py-2 rounded-md",
        (variant === "Solid" && "border-transparent bg-neutral-900 text-neutral-100 hover:bg-neutral-800"),
        (variant === "Outline" && "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100")
      )}
      {...props}
    >
      {props.children}
    </button>
  )
}

export default Button;