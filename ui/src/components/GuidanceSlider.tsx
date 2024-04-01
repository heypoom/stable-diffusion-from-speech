import Slider from '@mui/joy/Slider'
import { useStore } from '@nanostores/react'

import { $guidance } from '../store/guidance'

export const GuidanceSlider = () => {
  const guidance = useStore($guidance)

  return (
    <div className='w-full min-w-[350px]'>
      <Slider
        value={guidance}
        onChange={(_, value) => {
          if (typeof value === 'number') {
            $guidance.set(value)
          }
        }}
        min={0}
        defaultValue={50}
        max={100}
        variant='soft'
        color='neutral'
      />
    </div>
  )
}