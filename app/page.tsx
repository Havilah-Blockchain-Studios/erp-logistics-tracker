'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Truck, Package, BarChart2 } from 'lucide-react'
import ShipmentABI from '@/abis/Shipment.json'

const shipmentContractAddress = process.env.NEXT_PUBLIC_SHIPMENT_CONTRACT_ADDRESS || ''

export default function Home() {
  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [shipmentContract, setShipmentContract] = useState<ethers.Contract | null>(null)
  const [totalShipments, setTotalShipments] = useState(0)
  const [activeShipments, setActiveShipments] = useState(0)
  const [shipmentId, setShipmentId] = useState('')
  const [shipmentData, setShipmentData] = useState<any>(null)

  useEffect(() => {
    initializeEthers()
  }, [])

  const initializeEthers = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      })
      const instance = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const signer = provider.getSigner()
      const address = await signer.getAddress()

      const contract = new ethers.Contract(shipmentContractAddress, ShipmentABI.abi, signer)

      setAccount(address)
      setProvider(provider)
      setShipmentContract(contract)

      fetchDashboardData(contract)
    } catch (error) {
      console.error("Failed to initialize ethers:", error)
    }
  }

  const fetchDashboardData = async (contract: ethers.Contract) => {
    try {
      const total = await contract.getTotalShipments()
      const active = await contract.getActiveShipments()
      setTotalShipments(total.toNumber())
      setActiveShipments(active.toNumber())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const trackShipment = async () => {
    if (!shipmentContract) return
    try {
      const data = await shipmentContract.getShipment(shipmentId)
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Truck className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-800">ERP Logistics Tracker</h1>
              </div>
            </div>
            <div className="flex items-center">
              {account ? (
                <span className="text-sm text-gray-500">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
              ) : (
                <Button onClick={initializeEthers}>Connect Wallet</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {provider && shipmentContract ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShipments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeShipments}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shipment Analytics</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Shipment analytics visualization would go here.</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-600">Please connect your wallet to use the application.</p>
          </div>
        )}
      </main>
    </div>
  )
}