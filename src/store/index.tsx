import React from 'react'
import get from 'lodash.get'
import { DataType } from '../common'

export const ConfigContext = React.createContext<
  {
    optionsMap: OptionsMap
  } & Record<string, any>
>({
  optionsMap: {},
})

export type OptionsMap = Record<string, Option>

type Option = {
  label: string
  type?: DataType
  nested?: OptionsMap
  values?: Array<{ label: string; value: any }>
}

export const getNestedOption = (
  optionsMap: OptionsMap,
  accumulatedKey: string
): Option | undefined => {
  const path = getPath(accumulatedKey)
  if (!path.length) return
  return get(optionsMap, path, {})
}

export const getKeys = (optionsMap: OptionsMap, accumulatedKey: string) => {
  return Object.entries(
    accumulatedKey
      ? getNestedOption(optionsMap, accumulatedKey)?.nested ?? {}
      : optionsMap
  ).map(([key, config]) => ({
    value: key,
    label: config.label,
  }))
}

const getPath = (accumulatedKey: string) => {
  return accumulatedKey
    .split('.')
    .filter(Boolean)
    .flatMap((element, i) => (i === 0 ? [element] : ['nested', element]))
}
