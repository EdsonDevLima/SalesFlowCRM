import { useEffect, useState } from "react"
import type { ICustomer } from "../../types/customers"
import api from "../../service/api"
import { FaEye } from "react-icons/fa"
import { CustomerFormEdit } from "../forms/edit/customersEdit"
import Styles from "./recentCustomers.module.css"

export function RecentCustomers() {
  const [recentCustomers, setRecentCustomers] = useState<ICustomer[]>([])
  const [loading, setLoading] = useState(false)
  const [customerEditing, setCustomerEditing] = useState<ICustomer | null>(null)

  const getRecentCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.get("user/customers")
      const data = (response.data.items as ICustomer[]) || []
      
      // Pega apenas os 5 últimos clientes cadastrados
      const sortedData = data
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        .slice(0, 5)
      
      setRecentCustomers(sortedData)
    } catch (error) {
      console.error("Erro ao buscar clientes recentes:", error)
      setRecentCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRecentCustomers()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível"
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

  if (recentCustomers.length === 0) {
    return <p className={Styles.nother}>Nenhum cliente cadastrado recentemente</p>
  }

  return (
    <>
      <div className={Styles.recentList}>
        {recentCustomers.map((customer) => (
          <div key={customer.id} className={Styles.recentCard}>
            <div className={Styles.customerInfo}>
              <p className={Styles.customerName}>{customer.name}</p>
              <p className={Styles.customerEmail}>{customer.email}</p>
              <p className={Styles.customerDate}>
                {formatDate(customer.createdAt || "")}
              </p>
            </div>
            <button
              className="submitButton edit"
              onClick={() => setCustomerEditing(customer)}
              title="Ver detalhes"
            >
              <FaEye />
            </button>
          </div>
        ))}
      </div>

      {customerEditing && (
        <CustomerFormEdit
          Customers={customerEditing}
          displayModal={true}
          onClose={() => setCustomerEditing(null)}
          onUpdated={getRecentCustomers}
        />
      )}
    </>
  )
}
