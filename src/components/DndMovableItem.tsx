import React, { useRef } from 'react'
import { Card } from 'react-bootstrap'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from 'utils/react-dnd'
import classes from 'styles/sass/DndMovableItem.module.scss'

const DndMovableItem = ({
  item,
  index,
  moveItem,
  dropItem,
  closeItem,
  children,
}: any) => {
  const ref = useRef(null)

  const [, drop] = useDrop({
    accept: ItemTypes.MOVABLE,
    hover(item: any) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) {
        return
      }

      moveItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    drop() {
      if (!ref.current) {
        return
      }

      dropItem()
    },
  })

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MOVABLE,
    item: { id: item.id, index },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  }))

  drag(drop(ref))

  return (
    <Card
      id="closeablecard"
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      className={classes.card}
    >
      <Card.Header className={classes.header}>
        <div className={classes.grabHandle}></div>
        <div className={classes.titleText}>{item.label}</div>
        <span
          className={classes.close}
          aria-label="Close"
          onClick={(e) => closeItem(e, item.label)}
        >
          <span aria-hidden="true">&times;</span>
        </span>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}

export default DndMovableItem
