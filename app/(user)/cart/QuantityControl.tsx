type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantityControl({ quantity, onIncrease, onDecrease }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        className="border px-2 grid place-items-center cursor-pointer"
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        onClick={onIncrease}
        className="border px-2 grid place-items-center cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
