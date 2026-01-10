interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
}

export default function BarChart({ data, height = 300 }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full">
      <div
        className="flex items-end justify-around gap-4 px-4"
        style={{ height: `${height}px` }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 60);

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <div className="text-sm font-semibold mb-2 text-solid-gray-700">
                  {item.value}
                </div>
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${item.color}`}
                  style={{ height: `${barHeight}px`, minHeight: '4px' }}
                />
              </div>
              <div className="mt-3 text-xs text-center font-medium text-solid-gray-600">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
