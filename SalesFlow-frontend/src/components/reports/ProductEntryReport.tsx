import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { IProducts } from '../../types/products';
import api from '../../service/api';

type ChartData = {
  week: string;
  entry: number;
};

export function ProductEntryReport() {
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
      { week: 'Primeira', entry: 12 },
      { week: 'Segunda', entry: 5 },
      { week: 'Terceira', entry: 25 },
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
    <div>
      <h3>Relatório de entrada por semana (últimos 30 dias)</h3>
      <BarChart width={350} height={350} data={chartData}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="entry"
          name="Produtos que entraram na semana"
          fill="#4CAF50"
        />
      </BarChart>
    </div>
  );
}