
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Modal } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { trpc } from 'utils/trpc'
import { CreateLocationModel } from 'models/location'

interface AddDashboardItemButtonProps {
  location: string
  latitude: string
  longitude: string
  isAdded: boolean
}

const AddDashboardItemButton = ({
  location,
  latitude,
  longitude,
  isAdded,
}: AddDashboardItemButtonProps) => {
  const { data: session } = useSession()
  const [isLoading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const utils = trpc.useContext()

  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  const { mutate: createUserLocation } = trpc.user.createLocation.useMutation({
    onSuccess() {
      setLoading(false)
      utils.user.getLocations.invalidate()
    },
    onError(error) {
      setLoading(false)
      alert(error.message)
    },
  })

  useEffect(() => {
    if (isLoading) {
      const data: CreateLocationModel = {
        label: location,
        latitude,
        longitude,
      }
      createUserLocation(data)
    }
  }, [isLoading])

  const handleClick = () => {
    if (session) {
      if (isAdded) return
      setLoading(true)
    } else {
      handleShowModal()
    }
  }

  return (
    <>
      <Button
        variant={isAdded ? 'success' : 'primary'}
        disabled={isLoading}
        onClick={!isLoading ? handleClick : () => null}
      >
        {isLoading
          ? 'Updating...'
          : isAdded
          ? 'Saved'
          : 'Add to Dashboard'}
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Body>
          To manage your dashboard, please <Link href="/auth">login.</Link>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddDashboardItemButton
