const kartsMap = {
  "1": "#999900",
  "2": "#003366",
  "3": "#003300",
  "4": "#660000",
  "5": "#999900",
  "6": "#003300",
  "7": "#660000",
  "8": "#999900",
  "9": "#660000",
  "10": "#003300",
  "11": "#003366",
  "12": "#003366",
  "13": "#660000",
  "14": "#999900",
  "15": "#999900",
  "16": "#003366",
};

const KartElement = ({ count }: { count: string | number }) => {
  return (
    <div style={{ backgroundColor: kartsMap[count] || "#003366" }} className={`flex justify-center items-center w-8 h-8 rounded-full`}>
      {count}
    </div>
  );
};

export default KartElement;
