import {useMatchRoute, useRouterState} from '@tanstack/react-router'

const programNameMap: Record<string, string> = {
  one: '1',
  two: '2',
  'two-b': '2B',
  three: '3',
  four: '4',
}

export function CurrentProgramBadge() {
  const routeState = useRouterState()
  const mr = useMatchRoute()
  const isSpeechRoute = mr({to: '/'})

  const currentProgramKey = routeState.location.href.replace('/', '')
  const currentProgram = programNameMap[currentProgramKey]

  if (isSpeechRoute) return null

  return (
    <div className="bg-[#2d2d30] text-white leading-3 px-[5px] py-[4px] text-xs rounded-md">
      {currentProgram}
    </div>
  )
}
