interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 rounded font-bold
        ${variant === 'primary' 
          ? 'bg-blue-500 text-white hover:bg-blue-700' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
} 