import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import update from 'immutability-helper'
import type { Location } from '@prisma/client'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { SyncLoader } from 'react-spinners'
import { trpc } from 'utils/trpc'
import ForecastPreview from 'components/ForecastPreview'
import DndMovableItem from 'components/DndMovableItem'
import ContentWrapper from 'components/ContentWrapper'
import classes from 'styles/sass/DashboardPage.module.scss'

const DashboardPage = () => {
  const [movableItems, setMovableItems] = useState<Location[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const utils = trpc.useContext()

  const { data: userLocations } = trpc.user.getLocations.useQuery()

  const { mutate: deleteUserLocation } = trpc.user.deleteLocation.useMutation({
    onSuccess() {
      utils.user.getLocations.invalidate()
    },
    onError(error) {
      alert(error.message)
    },
  })

  const { mutate: updateDisplayOrder } =
    trpc.user.updateLocationsDisplayOrder.useMutation({
      onSuccess() {
        utils.user.getLocations.invalidate()
      },
      onError(error) {
        alert(error.message)
      },
    })

  useEffect(() => {
    setIsMobile(window.innerWidth < 600)

    if (!userLocations || userLocations.length < 1) {
      utils.user.getLocations.invalidate()
    }
  }, [])

  useEffect(() => {
    const locations = userLocations?.map((userLocation) => {
      return userLocation.location
    })

    if (locations) {
      setMovableItems(locations)
    }
  }, [userLocations])

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = movableItems[dragIndex]
    setMovableItems(
      update(movableItems, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedItem],
        ],
      })
    )
  }

  const dropItem = () => {
    const newOrder = movableItems.map((item, index) => {
      return {
        locationId: item.id,
        displayOrder: index,
      }
    })

    updateDisplayOrder(newOrder)
  }

  const closeItem = (e: React.MouseEvent<HTMLElement>, label: string) => {
    e.preventDefault()
    if (movableItems.length === 1) {
      alert('Item cannot be deleted')
      return
    }
    if (window.confirm('Remove item from your dashboard?')) {
      const data = {
        label,
      }
      deleteUserLocation(data)
    }
  }

  let jsx: JSX.Element = (
    <ContentWrapper>
      <SyncLoader
        loading={userLocations === undefined}
        aria-label="Loading Spinner"
        color="#f542cb"
      ></SyncLoader>
    </ContentWrapper>
  )

  if (userLocations) {
    const itemsJSX = movableItems.map((movableItem, index) => {
      return (
        <Col md={4} key={index}>
          <DndMovableItem
            index={index}
            item={movableItem}
            key={movableItem.label}
            moveItem={moveItem}
            dropItem={dropItem}
            closeItem={closeItem}
          >
            <ForecastPreview
              location={movableItem.label}
              latitude={movableItem.latitude.toString()}
              longitude={movableItem.longitude.toString()}
            />
          </DndMovableItem>
        </Col>
      )
    })

    jsx = (
      <div className={classes.container}>
        <main className={classes.main}>
          <div className={classes.flexContainer}>
            <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
              <Container>
                <Row>{itemsJSX}</Row>
              </Container>
            </DndProvider>
          </div>
        </main>
      </div>
    )
  }

  return jsx
}

DashboardPage.requireAuth = true

export default DashboardPage
