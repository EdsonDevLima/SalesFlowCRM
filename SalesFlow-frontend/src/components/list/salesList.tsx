import { useEffect, useState, useCallback } from "react"
import type { SalesResult } from "../../types/sales"
import api from "../../service/api"
import { FaEye } from "react-icons/fa"
import { CiTrash } from "react-icons/ci"
import { FormSales } from "../forms/register/formSales"
import Style from "./salesList.module.css"
import { SalesFormEdit } from "../forms/edit/salesFormEdit"
import { SearchSales } from "../search/searchSales"
import { toast } from "react-toastify"

export function SalesList() {
  const [allSales, setAllSales] = useState<SalesResult[]>([])
  const [removeList, setRemoveList] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [saleEditing, setSaleEditing] = useState<SalesResult | null>(null)

  const changeRemoveList = (value: number) => {
    setRemoveList((prevList) => {
      return prevList.includes(value)
        ? prevList.filter((i) => i !== value)
        : [...prevList, value]
    })
  }

  const getSales = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get("sales/all")
      const data = (response.data as SalesResult[]) || []
      setAllSales(data)
    } catch (error) {
      console.error("Erro ao buscar vendas:", error)
      setAllSales([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteSelected = async () => {
    if (removeList.length === 0) return

    if (!confirm(`Deseja realmente remover ${removeList.length} venda(s)?`)) {
      return
    }

    try {
      setLoading(true)

      await Promise.all(
        removeList.map((id) => api.delete(`Sales/delete/${id}`))
      )

      setAllSales((prevSales) =>
        prevSales.filter((sale) => !removeList.includes(sale.id))
      )

      setRemoveList([])
    } catch (error) {
      toast.info(`${error}`);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSales()
  }, [getSales])

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value)
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
  const filteredSales = allSales.filter((sale) =>
  sale.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
  sale.id.toString().includes(search)
)

  return (
    <div>
      <div className="header-actions">
        <FormSales onSaleAdded={getSales} />
        <SearchSales value={search} onChange={setSearch}/>
        <button
          className="submitButton error"
          onClick={handleDeleteSelected}
          disabled={removeList.length === 0 || loading}
        >
          <CiTrash />
          {removeList.length > 0 && ` (${removeList.length})`}
        </button>
      </div>

      {loading && <p>Carregando...</p>}

      {allSales.length > 0 ? <div className={Style.SalesList}>
        {
          filteredSales.map((i) => (
            <div key={i.id} className={Style.cardSales}>
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={removeList.includes(i.id)}
                  onChange={() => changeRemoveList(i.id)}
                />
                <span className="custom-checkbox"></span>
              </label>

              <div className={Style.aditionalInfor}>
                <p>#{i.id}</p>
                <p>Cliente: {i.user?.name}</p>
                <p className={Style.date}>
                  {formatDate(i.created_at)}
                </p>
                <p
                  className={Style.status}
                  style={{
                    backgroundColor: i.status === "pending" ? "#fef3c7" : "#dcfce7",
                    color: i.status === "pending" ? "#92400e" : "#166534",
                  }}
                >
                  {i.status === "pending" ? "Pendente" : "Concluído"}
                </p>
                <p>
                  <strong>Total: {formatCurrency(`${i.total}`)}</strong>
                </p>
              </div>

              <div className={Style.ConteinerButton}>
                <button
                  className="submitButton edit"
                  onClick={() => setSaleEditing(i)}
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))
        }
      </div> : <p className={Style.nother}>Nenhuma venda registrada.</p>}

      {saleEditing && (
        <SalesFormEdit
          sale={saleEditing}
          displayModal={true}
          onClose={() => setSaleEditing(null)}
          onUpdated={getSales}
        />
      )}
    </div>
  )
}
