

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-primary-900 text-white hover:bg-primary-800",
        secondary: "bg-white text-primary-900 hover:bg-gray-100",
        outline: "border-2 border-white text-white hover:bg-white/10",
        accent: "bg-accent-orange text-white hover:bg-orange-600 shadow-md",
    };

    const sizes = {
        sm: "px-4 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg",
    };

    const width = fullWidth ? "w-full" : "";
    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}