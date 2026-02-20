const style = {

  base:
    "w-full py-2 rounded-lg transition font-medium focus:outline-none",

  primary:
    "bg-black text-white hover:bg-gray-900 active:bg-gray-800",

  secondary:
    "bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400",

  disabled:
    "opacity-50 cursor-not-allowed"

};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false
}) => {

  const variantStyle =
    variant === "secondary"
      ? style.secondary
      : style.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${style.base} ${variantStyle} ${disabled ? style.disabled : ""}`}
    >
      {children}
    </button>
  );

};

export default Button;