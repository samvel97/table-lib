export interface Order {
  id: number
  customer: string
  city: string
  amount: number
  status: 'paid' | 'pending' | 'refunded'
  createdAt: string
}

const CUSTOMERS = [
  'Anna Petrosyan',
  'Daniel Brown',
  'Mary Johnson',
  'Aram Grigoryan',
  'Sofia Rossi',
  'Lucas Martin',
  'Nare Hakobyan',
  'Ethan Clark',
]
const CITIES = ['Yerevan', 'Gyumri', 'Berlin', 'Paris', 'Milan', 'London', 'Vanadzor', 'Tbilisi']
const STATUSES: Order['status'][] = ['paid', 'pending', 'refunded']

/** Deterministic sample data, so screenshots are comparable between runs. */
export function generateOrders(count: number): Order[] {
  let seed = 7
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const start = Date.UTC(2026, 0, 1)
  return Array.from({ length: count }, (_, index) => ({
    id: 1001 + index,
    customer: CUSTOMERS[Math.floor(random() * CUSTOMERS.length)],
    city: CITIES[Math.floor(random() * CITIES.length)],
    amount: Math.round(random() * 250000) / 100,
    status: STATUSES[Math.floor(random() * STATUSES.length)],
    createdAt: new Date(start + Math.floor(random() * 300) * 86_400_000).toISOString(),
  }))
}
