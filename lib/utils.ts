import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function getShipmentStatusText(status: number): string {
  const statusMap = ['Created', 'InTransit', 'Delivered']
  return statusMap[status] || 'Unknown'
}