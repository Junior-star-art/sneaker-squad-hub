import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddressForm } from "./AddressForm"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Address {
  id: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export function AddressList() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .order("is_default", { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Address deleted",
        description: "The address has been successfully deleted.",
      })
      fetchAddresses()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSuccess={() => {
              fetchAddresses()
              setIsEditDialogOpen(false)
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {address.is_default && (
                  <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full mr-2">
                    Default
                  </span>
                )}
                {address.address_line1}
              </CardTitle>
              <CardDescription>
                {address.address_line2 && `${address.address_line2}, `}
                {address.city}, {address.state} {address.postal_code}
                <br />
                {address.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAddress(address)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Address</DialogTitle>
                    </DialogHeader>
                    {selectedAddress && (
                      <AddressForm
                        addressId={selectedAddress.id}
                        defaultValues={selectedAddress}
                        onSuccess={() => {
                          fetchAddresses()
                          setIsEditDialogOpen(false)
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}