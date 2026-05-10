import logoSvg from '../../assets/the_life_game_logo.svg'

export default function Logo() {
  return (
    <div className="logo-panel">
      <img src={logoSvg} alt="The Life Game" className="logo-panel__image" />
    </div>
  )
}
