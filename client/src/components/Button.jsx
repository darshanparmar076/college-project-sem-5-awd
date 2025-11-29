function Button({ children, className, disabled = false, ...props }) {
  return (
    <button
      className={`btn-primary ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
