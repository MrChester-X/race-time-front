import { useRaceStore } from "./store/useRaceStore";

const Colors = ["bg-blue-500", "bg-green-700", "bg-yellow-600", "bg-red-700"];

const Kart = ({ kart }: { kart: string }) => {
  const { focusKart, setFocusKart, kartColors, setKartColors } = useRaceStore();

  const handleClick = () => {
    const newColors = { ...kartColors };
    newColors[kart] = ((newColors[kart] ?? 0) + 1) % Colors.length;
    setKartColors(newColors);
  };

  const currentColorIndex = kartColors[kart] || 0;
  const currentColor = Colors[currentColorIndex];

  return (
    <div
      onMouseEnter={() => setFocusKart(kart)}
      onMouseLeave={() => setFocusKart(null)}
      onClick={handleClick}
      className={`flex justify-center items-center text-xs w-7 h-7 rounded-full ${kart === focusKart ? "bg-fuchsia-600" : currentColor} cursor-grab`}
    >
      {kart.padStart(2, "0")}
    </div>
  );
};

export default Kart;
