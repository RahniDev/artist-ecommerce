import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const SlidePrevButton = ({ onClick }: { onClick: () => void }) => {

  return (
    <span className="swiper-prev" onClick={onClick}>
      <KeyboardArrowLeftIcon />
    </span>
  )
}

export default SlidePrevButton