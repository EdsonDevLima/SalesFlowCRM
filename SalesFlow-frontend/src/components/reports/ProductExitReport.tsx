import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../../service/api';
import type { SalesResult } from '../../types/sales';

type ChartData = {
  week: string;
  sales: number;
};

export function ProductExitReport() {
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
    console.log(allSales)
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
      const createdAt = parseDate(sale.created_at|| '');

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
    <div>
      <h3>Relatório de vendas por semana (últimos 30 dias)</h3>
      <BarChart width={350} height={350} data={chartData}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="sales"
          name="Vendas realizadas na semana"
          fill="#b3c433ff"
        />
      </BarChart>
    </div>
  );
}
