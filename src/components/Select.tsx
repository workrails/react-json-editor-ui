import {
  AutoComplete,
  AutoCompleteProps,
  Select as WorkRailsSelect,
  SelectProps,
} from '@workrails/ui'
import React from 'react'

export const Select = ({
  allowCustom = true,
  ...props
}: { allowCustom?: boolean } & AutoCompleteProps & SelectProps) => {
  if (allowCustom) {
    return <AutoComplete {...props} />
  }
  return <WorkRailsSelect {...props} />
}
