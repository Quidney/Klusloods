export default function formatCurrency({price}){
        return Intl.NumberFormat('nl-NL',{
             style: 'currency',
    currency: 'EUR', // Change as needed
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

    }