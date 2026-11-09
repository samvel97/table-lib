import type { ReactElement } from 'react'
import React, { memo, useState } from 'react'
import Select from '../../../components/select/select'
import ArrowDown from '../../../svgIcons/ArrowBottomSvgIcon'
import ArrowUp from '../../../svgIcons/ArrowtopSvgIcon'
import './style.scss'
import { CheckedItems } from '../../../Models/table.enum'
interface IDownloadTypes {
  id: number
  type: string
}
interface IDownload<T extends object> {
  checkedRows: T[]
  selectedType: string
  translations?: Record<string, any>
  getDownloadType: (option: string, checkedRows: T[] | string) => void
}
const Download = <T extends object>({ checkedRows, selectedType, translations, getDownloadType }: IDownload<T>) => {
  const [fileType] = useState<IDownloadTypes[]>([
    { id: 1, type: 'XLSX' },
    { id: 2, type: 'CSV' },
    // { id: 3, type: 'PDF' },
  ])
  const [isOpenList, setOpen] = useState<boolean>(false)

  const setIsOpenList = () => {
    setOpen((prev) => !prev)
  }
  const handleSelectItem = (option: IDownloadTypes) => {
    if (selectedType === CheckedItems.SELECTED_ALL) {
      getDownloadType(option.type, 'All')
    } else {
      getDownloadType(option.type, checkedRows)
    }
  }

  return (
    <Select
      optionsList={fileType}
      value={-1}
      selectedNameKey={'type'}
      selectedValueKey={'id'}
      onChange={handleSelectItem}
      isOpenList={isOpenList}
      setIsOpenList={setIsOpenList}
      customClass='P-download'
      label={translations?.dowloadAction || 'Download report'}
      ButtonSvg={isOpenList ? ArrowUp : ArrowDown}
    />
  )
}

export default memo(Download) as <T extends object>(props: IDownload<T>) => ReactElement
