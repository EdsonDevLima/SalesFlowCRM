import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../service/api';
import type { SalesResult } from '../../types/sales';
import Styles from './Reports.module.css';

type ChartData = {
  week: string;
  sales: number;
};

export function ProductExitReport() {
  const [isOpen, setIsOpen] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([
    { week: 'Primeira Semana', sales: 0 },
    { week: 'Segunda Semana', sales: 0 },
    { week: 'Terceira Semana', sales: 0 },
    { week: 'Quarta Semana', sales: 0 },
  ]);

  const [allSales, setAllSales] = useState<SalesResult[]>([]);

  const getSales = async () => {
    const response = await api.get('sales/all');
    const data = (response.data as SalesResult[]) || [];
    setAllSales(data);
  };

  const parseDate = (dateString: string): Date => {
    let date = new Date(dateString);

    if (isNaN(date.getTime()) && dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        date = new Date(+parts[2], +parts[1] - 1, +parts[0]);
      }
    }

    return date;
  };

  useEffect(() => {
    getSales();
  }, []);

  useEffect(() => {
    if (allSales.length === 0) return;

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const start30DaysAgo = new Date();
    start30DaysAgo.setDate(now.getDate() - 30);
    start30DaysAgo.setHours(0, 0, 0, 0);

    const newChartData: ChartData[] = [
      { week: 'Primeira', sales: 0 },
      { week: 'Segunda', sales: 0 },
      { week: 'Terceira', sales: 0 },
      { week: 'Quarta', sales: 0 },
    ];

    allSales.forEach(sale => {
      const createdAt = parseDate(sale.created_at || '');

      if (createdAt >= start30DaysAgo && createdAt <= now) {
        const diffInMs = createdAt.getTime() - start30DaysAgo.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(Math.floor(diffInDays / 7), 3);

        newChartData[weekIndex].sales += 1;
      }
    });

    setChartData(newChartData);
  }, [allSales]);

  return (
    <div className={Styles.reportContainer}>
      <h3 
        className={Styles.reportTitle} 
        onClick={() => setIsOpen(!isOpen)}
      >
        Relatório de vendas por semana (últimos 30 dias)
        <span className={`${Styles.arrow} ${isOpen ? Styles.arrowOpen : ''}`}>
          ▼
        </span>
      </h3>
      
      <div className={`${Styles.chartWrapper} ${isOpen ? Styles.chartOpen : ''}`}>
        <div className={Styles.chartInner}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="sales"
                name="Vendas realizadas na semana"
                fill="#b3c433ff"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
