import React from "react";
import ChartComponent from "../../../Components/ChartComponent/ChartComponent";

const data = {
  labels: ["Янв", "Фев", "Март", "Апр", "Май"],
  datasets: [
    {
      label: "Продажи",
      data: [65, 59, 80, 81, 56],
      backgroundColor: ["rgba(75,192,192,0.2)"],
      borderColor: ["rgba(75,192,192,1)"],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

<ChartComponent />

const Customers = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Customers test chart</h2>
      <ChartComponent type="line" data={data} options={options} />
      <ChartComponent type="bar" data={data} options={options} />
      <ChartComponent type="doughnut" data={data} options={options} />
    </div>
  );
};

export default Customers;
