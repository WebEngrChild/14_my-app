type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-[#5f52e9] px-4 py-2 text-sm text-white"
    >
      {children}
    </button>
  );
}
