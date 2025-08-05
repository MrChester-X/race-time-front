const Colors = ["bg-blue-500", "#003300", "#999900", "#660000"];

const kartsColors: { [kart: string]: number } = {};

const Kart = ({
  kart,
  focusKart,
  setFocusKart,
}: {
  kart: string;
  focusKart: string | null;
  setFocusKart: (kart: string | null) => void;
}) => (
  <div
    onMouseEnter={() => setFocusKart(kart)}
    onMouseLeave={() => setFocusKart(null)}
    onClick={() => {
      kartsColors[kart] = ((kartsColors[kart] || -1) + 1) % Colors.length;
      console.log(kartsColors[kart]);
    }}
    className={`flex justify-center items-center text-xs w-7 h-7 rounded-full ${kart === focusKart ? "bg-fuchsia-600" : Colors[kartsColors[kart] || 0]} cursor-grab`}
  >
    {kart.padStart(2, "0")}
  </div>
);

export default Kart;
