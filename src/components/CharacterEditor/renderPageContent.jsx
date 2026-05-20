import React from 'react'
import { ChartPage } from './ChartPage'
import { LocationPage } from './LocationPage'
import { CharacterPage } from './CharacterPage'

export function renderPageContent(activePage, props) {
  if (activePage === 'chart') {
    return <ChartPage
      natalPlacements={props.natalPlacements}
      houseCusps={props.houseCusps}
      birthDate={props.birthDate}
      onBirthDateChange={props.handleBirthDateChange}
      birthTime={props.birthTime}
      onBirthTimeChange={props.handleBirthTimeChange}
    />
  }
  if (activePage === 'location') {
    return <LocationPage birthCity={props.birthCity} onBirthCityChange={props.setBirthCity} />
  }
  if (activePage === 'character') {
    return <CharacterPage
      displayColors={props.displayColors}
      colors={props.colors}
      onColorsChange={props.setColors}
      onPreviewColors={props.setPreviewColors}
      initialName={props.initialName}
      name={props.name}
      onNameChange={props.setName}
      limited={props.limited}
      birthDataOutput={props.birthDataOutput}
      trimmedName={props.trimmedName}
      colorsRef={props.colorsRef}
      onSave={props.onSave}
      onClose={props.onClose}
      onChange={props.onChange}
    />
  }
}
