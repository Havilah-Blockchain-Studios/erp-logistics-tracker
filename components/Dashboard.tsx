import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardProps {
  contract: ethers.Contract
}

export default function Dashboard({ contract }: DashboardProps) {
  const [totalShipments, setTotalShipments] = useState(0)
  const [activeShipments, setActiveShipments] = useState(0)

  useEffect(() => {
    fetchDashboardData()
  }, [contract])

  const fetchDashboardData = async () => {
    try {
      const total = await contract.getTotalShipments()
      const active = await contract.getActiveShipments()
      setTotalShipments(total.toNumber())
      setActiveShipments(active.toNumber())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalShipments}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{activeShipments}</p>
        </CardContent>
      </Card>
    </div>
  )
}
