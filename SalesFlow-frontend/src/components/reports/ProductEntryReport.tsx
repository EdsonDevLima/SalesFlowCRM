import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { IProducts } from '../../types/products';
import api from '../../service/api';
import Styles from './Reports.module.css';

type ChartData = {
  week: string;
  entry: number;
};

export function ProductEntryReport() {
  const [isOpen, setIsOpen] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([
    { week: 'Primeira Semana', entry: 0 },
    { week: 'Segunda Semana', entry: 0 },
    { week: 'Terceira Semana', entry: 0 },
    { week: 'Quarta Semana', entry: 0 },
    
  ]);
  const [allProducts, setAllProducts] = useState<IProducts[]>([]);

  const getProducts = async () => {
    const response = await api.get('products/all');
    const items = (response.data.items as IProducts[]) || [];
    setAllProducts(items);
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
    getProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const start30DaysAgo = new Date();
    start30DaysAgo.setDate(now.getDate() - 30);
    start30DaysAgo.setHours(0, 0, 0, 0);

    const newChartData = [
      { week: 'Primeira', entry: 0 },
      { week: 'Segunda', entry: 0 },
      { week: 'Terceira', entry: 0 },
      { week: 'Quarta', entry: 0 },
    ];

    allProducts.forEach(product => {
      const createdAt = parseDate(product.createdAt || "");

      if (createdAt >= start30DaysAgo && createdAt <= now) {
        const diffInMs = createdAt.getTime() - start30DaysAgo.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(Math.floor(diffInDays / 7), 3);

        newChartData[weekIndex].entry += 1;
      }
    });

    setChartData(newChartData);
  }, [allProducts]);

  return (
    <div className={Styles.reportContainer}>
      <h3 
        className={Styles.reportTitle} 
        onClick={() => setIsOpen(!isOpen)}
      >
        Relatório de entrada por semana (últimos 30 dias)
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
                dataKey="entry"
                name="Produtos que entraram na semana"
                fill="#4CAF50"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
