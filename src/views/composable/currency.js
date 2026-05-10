import { ref } from 'vue'
import axios from 'axios'

const currencySymbol = ref('$')
const currencyCode = ref('USD')

export const useCurrency = () => {
  const getCurrencySymbol = () => {
    return currencySymbol.value
  }
  
  const getCurrencyCode = () => {
    return currencyCode.value
  }
  
  const formatPrice = (price) => {
    const num = parseFloat(price)
    if (isNaN(num)) return '0.00'
    return `${currencySymbol.value}${num.toFixed(2)}`
  }
  
  const fetchCompanyCurrency = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const response = await axios.get('http://localhost:3002/company/info', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data && response.data.currency) {
        currencyCode.value = response.data.currency
        currencySymbol.value = response.data.currency === 'KHR' ? '៛' : '$'
      }
    } catch (err) {
      console.error('Failed to fetch company currency:', err)
    }
  }
  
  return {
    formatPrice,
    getCurrencySymbol,
    getCurrencyCode,
    fetchCompanyCurrency
  }
}