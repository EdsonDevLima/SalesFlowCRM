import { useState } from "react"
import Styles from "./Salesfilter.module.css"

interface SalesFilterProps {
  onFilterChange: (filters: FilterOptions) => void
}

export interface FilterOptions {
  period: "today" | "week" | "month" | "all"
  status: "all" | "pending" | "completed"
  minValue?: number
  maxValue?: number
}

export function SalesFilter({ onFilterChange }: SalesFilterProps) {
  const [period, setPeriod] = useState<FilterOptions["period"]>("all")
  const [status, setStatus] = useState<FilterOptions["status"]>("all")
  const [minValue, setMinValue] = useState<string>("")
  const [maxValue, setMaxValue] = useState<string>("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (
    newPeriod?: FilterOptions["period"],
    newStatus?: FilterOptions["status"],
    newMinValue?: string,
    newMaxValue?: string
  ) => {
    const updatedPeriod = newPeriod ?? period
    const updatedStatus = newStatus ?? status
    const updatedMinValue = newMinValue ?? minValue
    const updatedMaxValue = newMaxValue ?? maxValue

    onFilterChange({
      period: updatedPeriod,
      status: updatedStatus,
      minValue: updatedMinValue ? parseFloat(updatedMinValue) : undefined,
      maxValue: updatedMaxValue ? parseFloat(updatedMaxValue) : undefined,
    })
  }

  const handlePeriodChange = (value: FilterOptions["period"]) => {
    setPeriod(value)
    handleFilterChange(value, undefined, undefined, undefined)
  }

  const handleStatusChange = (value: FilterOptions["status"]) => {
    setStatus(value)
    handleFilterChange(undefined, value, undefined, undefined)
  }

  const handleMinValueChange = (value: string) => {
    setMinValue(value)
    handleFilterChange(undefined, undefined, value, undefined)
  }

  const handleMaxValueChange = (value: string) => {
    setMaxValue(value)
    handleFilterChange(undefined, undefined, undefined, value)
  }

  const handleClearFilters = () => {
    setPeriod("all")
    setStatus("all")
    setMinValue("")
    setMaxValue("")
    setShowAdvanced(false)
    onFilterChange({
      period: "all",
      status: "all",
    })
  }

  return (
    <div className={Styles.filterContainer}>
      <div className={Styles.filterHeader}>
        <h3>Filtros de Vendas</h3>
        <button
          className={Styles.advancedToggle}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Ocultar filtros" : "Filtros avançados"}
        </button>
      </div>

      <div className={Styles.filterGroup}>
        <div className={Styles.filterRow}>
          <div className={Styles.filterItem}>
            <label>Período</label>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value as FilterOptions["period"])}
              className={Styles.select}
            >
              <option value="all">Todos</option>
              <option value="today">Hoje</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
            </select>
          </div>

          <div className={Styles.filterItem}>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as FilterOptions["status"])}
              className={Styles.select}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
        </div>

        {showAdvanced && (
          <div className={Styles.filterRow}>
            <div className={Styles.filterItem}>
              <label>Valor mínimo (R$)</label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => handleMinValueChange(e.target.value)}
                placeholder="0,00"
                className={Styles.input}
                min="0"
                step="0.01"
              />
            </div>

            <div className={Styles.filterItem}>
              <label>Valor máximo (R$)</label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => handleMaxValueChange(e.target.value)}
                placeholder="0,00"
                className={Styles.input}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}
      </div>

      {(period !== "all" || status !== "all" || minValue || maxValue) && (
        <button className={Styles.clearButton} onClick={handleClearFilters}>
          Limpar filtros
        </button>
      )}
    </div>
  )
}