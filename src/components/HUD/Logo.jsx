import logoSmall from '../../assets/logo_small.svg'

export default function Logo() {
  return (
    <div className="logo-panel">
      <img src={logoSmall} alt="The Life Game" className="logo-panel__image" />
    </div>
  )
}
