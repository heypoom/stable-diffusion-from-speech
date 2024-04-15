import cx from 'classnames'

import { GuidanceSlider } from './GuidanceSlider'
import { PromptInput } from './PromptInput'
import { useStore } from '@nanostores/react'
import {
  $apiReady,
  $generating,
  $inferencePreview,
  $prompt,
} from '../store/prompt'
import { $guidance } from '../store/guidance'
import { socket } from '../manager/socket.ts'
import { AnimatedNoise } from './AnimatedNoise.tsx'

interface Props {
  keyword?: string
  command: string
}

export function PromptManager(props: Props) {
  const { keyword, command } = props

  const prompt = useStore($prompt)
  const isGenerating = useStore($generating)
  const guidance = useStore($guidance)
  const previewUrl = useStore($inferencePreview)
  const apiReady = useStore($apiReady)

  const useKeyword = typeof keyword === 'string' && keyword.length > 0

  function handleChange(input: string) {
    $prompt.set(input)

    if (useKeyword) {
      const isKeyword = input
        .trim()
        .toLowerCase()
        .endsWith(keyword.toLowerCase())

      const segments = input.split(' ')

      if (isKeyword && segments.length > 2) {
        console.log(
          `generating "${input}" with guidance ${guidance} -> ${command}`,
        )

        $generating.set(true)

        if (!socket.ready) {
          console.log('[!!!!] socket not ready')
          return
        }

        if (command === 'P2') {
          socket.sock.send(`P2:${(guidance / 100).toFixed(2)}`)
        } else {
          socket.sock.send(command)
        }
      }
    }
  }

  function handleGuidanceChange(value: number) {
    console.log(`regenerating with guidance ${value}`)

    if (command === 'P2') {
      socket.sock.send(`P2:${(guidance / 100).toFixed(2)}`)
    }
  }

  return (
    <div className='flex bg-black min-h-screen'>
      <div className='fixed w-screen h-screen bg-transparent z-30'>
        <div className='flex flex-col items-center justify-center w-full h-full  bg-transparent'>
          <PromptInput
            input={{
              disabled: isGenerating || !apiReady,
              onChange: e => handleChange(e.target.value),
              value: prompt,
              onKeyDown: e => {
                // freestyle inference
                if (e.key === 'Enter' && !useKeyword) {
                  console.log(`inferencing: ${prompt}`)

                  $generating.set(true)

                  if (!socket.ready) {
                    console.log('[!!!!] socket not ready')
                    return
                  }

                  const sys = `${command}:${prompt}`
                  console.log(`> sent "${sys}"`)
                  socket.sock.send(sys)
                }
              },
            }}
            className={cx(!apiReady && 'bg-slate-800')}
          />

          <div className='pt-4'>
            <GuidanceSlider onChange={handleGuidanceChange} />
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className='fixed flex items-center justify-center w-full h-full z-20'>
          <img
            src={previewUrl}
            alt=''
            className='h-screen object-contain object-center fade-in-image'
          />
        </div>
      )}

      <div className='z-0'>
        <AnimatedNoise />
      </div>
    </div>
  )
}
