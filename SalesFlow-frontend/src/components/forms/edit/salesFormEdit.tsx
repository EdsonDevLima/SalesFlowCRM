import { useEffect, useState } from "react"
import type { SalesResult } from "../../../types/sales"
import Style from "./salesFormEdit.module.css"
import api from "../../../service/api"
import { toast } from "react-toastify"

export function SalesFormEdit({
  sale,
  displayModal,
  onClose
}: {
  sale: SalesResult
  displayModal: boolean
  onClose: () => void
}) {

  const [status, setStatus] = useState("")
  const [trackingCode, setTrackingCode] = useState("")

  useEffect(() => {
    if (sale) {
      setStatus(sale.status)
      setTrackingCode((sale as SalesResult).trackingCode || "")
    }
  }, [sale])

  if (!displayModal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.put(`/sales/update`, {
        status,
        trackingCode
      })

      toast.success("Venda atualizada com sucesso!")
      onClose()
    } catch (error) {
      toast.error(`Erro ao atualizar venda: ${error}`)
    }
  }

  return (
    <div
      className={Style.FormEditModal}
      onClick={onClose}
    >
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Editar venda</h3>


        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pendente</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </label>


        <label>
          Código de rastreio
          <input
            type="text"
            placeholder="Ex: BR1234567890"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
          />
        </label>


        <label>
          Cliente
          <input type="text" value={sale.user?.name} readOnly />
        </label>

        <label>
          Produtos:
          <select disabled>
            {sale.products.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label>
          Total:
          <input
            type="text"
            disabled
            value={Number(sale.total).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />
        </label>

        <input
          type="submit"
          value="Salvar alterações"
          className={Style.buttonEdit}
        />
      </form>
    </div>
  )
}