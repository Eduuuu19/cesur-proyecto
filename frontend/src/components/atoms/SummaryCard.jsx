import React from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis } from 'recharts'; import DateSelector from './DateSelector';
import styles from './SummaryCard.module.css';

export default function SummaryCard({ title, amount, variant = 'primary', data = [], chartType = 'area' }) {

  let amountColorClass = styles.amountPrimary;
  let chartColor = "var(--color-primary-500)";

  if (variant === 'success') {
    amountColorClass = styles.amountSuccess;
    chartColor = "var(--color-secondary-500)";
  } else if (variant === 'danger') {
    amountColorClass = styles.amountDanger;
    chartColor = "var(--color-danger-400)";
  }

  const isBarChart = chartType === 'bar';
  const formattedData = isBarChart ? data : data.map((num) => ({ value: num }));

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        {title}
      </div>

      <div className={styles.cardBody}>
        <DateSelector type="month" />

        <span className={`${styles.amount} ${amountColorClass}`}>
          {amount}
        </span>

        <div className={styles.miniChartWrapper}>

          <ResponsiveContainer width={isBarChart ? "40%" : "100%"} height="100%">

            {isBarChart ? (
              <BarChart data={formattedData}>
                <XAxis dataKey="name" hide={true} />
                <YAxis hide={true} />
                <Bar dataKey="value" barSize={20} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={formattedData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.15}
                  strokeWidth={2}
                  isAnimationActive={true}
                />
              </AreaChart>
            )}

          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}