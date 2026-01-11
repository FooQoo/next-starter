import type { TimeSeriesDataPoint } from '@/features/inquiry';

interface TrendChartProps {
  data: TimeSeriesDataPoint[];
  height?: number;
}

export default function TrendChart({ data, height = 200 }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-solid-gray-400"
        style={{ height: `${height}px` }}
      >
        データがありません
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const minValue = Math.min(...data.map((d) => d.count), 0);
  const range = maxValue - minValue || 1;

  // Calculate points for SVG path
  const padding = 20;
  const chartWidth = 100; // percentage
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * chartWidth;
    const y =
      chartHeight - ((point.count - minValue) / range) * chartHeight + padding;
    return { x, y, ...point };
  });

  // Create SVG path
  const pathD = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x} ${point.y}`;
    })
    .join(' ');

  // Create area path (for filled area under the line)
  const areaPathD = `${pathD} L ${chartWidth} ${chartHeight + padding} L 0 ${chartHeight + padding} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="w-full"
        style={{ height: `${height}px` }}
        preserveAspectRatio="none"
      >
        {/* Area under the line */}
        <path
          d={areaPathD}
          fill="url(#gradient)"
          opacity="0.2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#3b82f6"
            vectorEffect="non-scaling-stroke"
          >
            <title>
              {point.date}: {point.count}件
            </title>
          </circle>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-solid-gray-500">
        {data.length > 0 && (
          <>
            <span>{data[0].date}</span>
            <span>{data[data.length - 1].date}</span>
          </>
        )}
      </div>
    </div>
  );
}
