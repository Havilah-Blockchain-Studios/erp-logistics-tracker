import { useState } from 'react'
import { ethers } from 'ethers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ShipmentTrackerProps {
  contract: ethers.Contract
}

export default function ShipmentTracker({ contract }: ShipmentTrackerProps) {
  const [shipmentId, setShipmentId] = useState('')
  const [shipmentData, setShipmentData] = useState<any>(null)

  const trackShipment = async () => {
    try {
      const data = await contract.getShipment(shipmentId)
      setShipmentData({
        origin: data.origin,
        destination: data.destination,
        status: ['Created', 'InTransit', 'Delivered'][data.status],
        timestamp: new Date(data.timestamp.toNumber() * 1000).toLocaleString(),
      })
    } catch (error) {
      console.error('Error tracking shipment:', error)
      setShipmentData(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Enter Shipment ID"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
          />
          <Button onClick={trackShipment}>Track</Button>
        </div>
        {shipmentData && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Shipment Details</h3>
            <p><strong>Origin:</strong> {shipmentData.origin}</p>
            <p><strong>Destination:</strong> {shipmentData.destination}</p>
            <p><strong>Status:</strong> {shipmentData.status}</p>
            <p><strong>Last Updated:</strong> {shipmentData.timestamp}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
