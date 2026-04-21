import { useEffect, useState } from "react"
import type { SalesResult } from "../../types/sales"
import api from "../../service/api"
import { FaEye } from "react-icons/fa"
import { SalesFormEdit } from "../forms/edit/salesFormEdit"
import Styles from "./recentSales.module.css"

interface RecentSalesProps {
  filters?: {
    period: "today" | "week" | "month" | "all"
    status: "all" | "pending" | "completed"
    minValue?: number
    maxValue?: number
  }
}

export function RecentSales({ filters }: RecentSalesProps) {
  const [recentSales, setRecentSales] = useState<SalesResult[]>([])
  const [loading, setLoading] = useState(false)
  const [saleEditing, setSaleEditing] = useState<SalesResult | null>(null)

  const getRecentSales = async () => {
    try {
      setLoading(true)
      const response = await api.get("sales/all")
      let data = (response.data as SalesResult[]) || []
      
      // Aplica filtros se fornecidos
      if (filters) {
        // Filtro de período
        if (filters.period !== "all") {
          const now = new Date()
          const filterDate = new Date()
          
          if (filters.period === "today") {
            filterDate.setHours(0, 0, 0, 0)
          } else if (filters.period === "week") {
            filterDate.setDate(now.getDate() - 7)
          } else if (filters.period === "month") {
            filterDate.setMonth(now.getMonth() - 1)
          }
          
          data = data.filter((sale) => {
            const saleDate = new Date(sale.created_at)
            return saleDate >= filterDate
          })
        }
        
        // Filtro de status
        if (filters.status !== "all") {
          data = data.filter((sale) => sale.status === filters.status)
        }
        
        // Filtro de valor mínimo
        if (filters.minValue !== undefined) {
          data = data.filter((sale) => {
            const total = typeof sale.total === "string" ? parseFloat(sale.total) : sale.total
            return total >= filters.minValue!
          })
        }
        
        // Filtro de valor máximo
        if (filters.maxValue !== undefined) {
          data = data.filter((sale) => {
            const total = typeof sale.total === "string" ? parseFloat(sale.total) : sale.total
            return total <= filters.maxValue!
          })
        }
      }
      
      // Ordena por data e pega os 5 mais recentes
      const sortedData = data
        .sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })
        .slice(0, 5)
      
      setRecentSales(sortedData)
    } catch (error) {
      console.error("Erro ao buscar pedidos recentes:", error)
      setRecentSales([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRecentSales()
  }, [filters])

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return <p>Carregando...</p>
  }

  if (recentSales.length === 0) {
    return <p className={Styles.nother}>Nenhum pedido realizado recentemente</p>
  }

  return (
    <>
      <div className={Styles.recentList}>
        {recentSales.map((sale) => (
          <div key={sale.id} className={Styles.recentCard}>
            <div className={Styles.saleInfo}>
              <div className={Styles.saleHeader}>
                <p className={Styles.saleId}>Pedido #{sale.id}</p>
                <span
                  className={`${Styles.status} ${
                    sale.status === "pending" ? Styles.pending : Styles.completed
                  }`}
                >
                  {sale.status === "pending" ? "Pendente" : "Concluído"}
                </span>
              </div>
              <p className={Styles.customer}>Cliente: {sale.user?.name}</p>
              <p className={Styles.products}>
                {sale.products?.length || 0} produto(s)
              </p>
              <div className={Styles.saleFooter}>
                <p className={Styles.total}>{formatCurrency(sale.total)}</p>
                <p className={Styles.date}>{formatDate(sale.created_at)}</p>
              </div>
            </div>
            <button
              className="submitButton edit"
              onClick={() => setSaleEditing(sale)}
              title="Ver detalhes"
            >
              <FaEye />
            </button>
          </div>
        ))}
      </div>

      {saleEditing && (
        <SalesFormEdit
          sale={saleEditing}
          displayModal={true}
          onClose={() => setSaleEditing(null)}
          onUpdated={getRecentSales}
        />
      )}
    </>
  )
}
