type NewMemoButtonProps = {
  onClick?: () => void;
};

export default function NewMemoButton({ onClick }: NewMemoButtonProps) {
  return (
    <button
      type="button"
      aria-label="新しいメモを作成"
      onClick={onClick}
      className="flex size-14 items-center justify-center rounded-full bg-[#111] text-[28px] leading-none text-white hover:bg-[#333] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111]"
    >
      <span aria-hidden="true">+</span>
    </button>
  );
}
