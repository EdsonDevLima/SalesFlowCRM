// UsersReport.tsx - Atualizado
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../../service/api';
import type { ICustomer } from '../../types/customers';
import Styles from './Reports.module.css';

type ChartData = {
  week: string;
  customers: number;
};

export function UsersReport() {
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([
    { week: 'Primeira Semana', customers: 0 },
    { week: 'Segunda Semana', customers: 0 },
    { week: 'Terceira Semana', customers: 0 },
    { week: 'Quarta Semana', customers: 0 },
  ]);

  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([]);

  const getCustomers = async () => {
    try {
      const response = await api.get("user/customers");
      const data = response.data.items as ICustomer[] || [];
      setAllCustomers(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
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
    getCustomers();
  }, []);

  useEffect(() => {
    if (allCustomers.length === 0) return;

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const start30DaysAgo = new Date();
    start30DaysAgo.setDate(now.getDate() - 30);
    start30DaysAgo.setHours(0, 0, 0, 0);

    const newChartData: ChartData[] = [
      { week: 'Primeira', customers: 0 },
      { week: 'Segunda', customers: 0 },
      { week: 'Terceira', customers: 0 },
      { week: 'Quarta', customers: 0 },
    ];

    allCustomers.forEach(customer => {
      const createdAt = parseDate(customer.createdAt || '');

      if (createdAt >= start30DaysAgo && createdAt <= now) {
        const diffInMs = createdAt.getTime() - start30DaysAgo.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(Math.floor(diffInDays / 7), 3);

        newChartData[weekIndex].customers += 1;
      }
    });

    setChartData(newChartData);
  }, [allCustomers]);

  return (
    <div className={Styles.reportContainer}>
      <h3 
        className={Styles.reportTitle} 
        onClick={() => setIsOpen(!isOpen)}
      >
        Relatório de clientes por semana (últimos 30 dias)
        <span className={`${Styles.arrow} ${isOpen ? Styles.arrowOpen : ''}`}>
          ▼
        </span>
      </h3>
      
      <div className={`${Styles.chartWrapper} ${isOpen ? Styles.chartOpen : ''}`}>
        <BarChart width={350} height={350} data={chartData}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="customers"
            name="Clientes cadastrados na semana"
            fill="#2c399dff"
          />
        </BarChart>
      </div>
    </div>
  );
}