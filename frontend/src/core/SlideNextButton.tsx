import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const SlideNextButton = ({onClick}: {onClick: () => void}) => {
  return (
    <span className="swiper-next" onClick={onClick}>
      <KeyboardArrowRightIcon />
    </span>
  )
}

export default SlideNextButton