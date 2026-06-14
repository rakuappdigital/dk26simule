export function formatMatchDate(utcDate: string): string {
  const d = new Date(utcDate)
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Istanbul',
  })
}

export function groupLabel(group: string | null): string {
  if (!group) return ''
  return group.replace('GROUP_', 'Grup ')
}

export function statusLabel(status: string): { text: string; cls: string } {
  switch (status) {
    case 'FINISHED':       return { text: 'Bitti', cls: 'text-muted' }
    case 'IN_PLAY':        return { text: 'CANLI', cls: 'text-green-400 font-bold animate-pulse' }
    case 'PAUSED':         return { text: 'Devre arası', cls: 'text-yellow-400' }
    case 'HALFTIME':       return { text: 'İlk yarı bitti', cls: 'text-yellow-400' }
    case 'EXTRA_TIME':     return { text: 'Uzatma', cls: 'text-orange-400 font-bold' }
    case 'PENALTY_SHOOTOUT': return { text: 'Penaltılar', cls: 'text-red-400 font-bold' }
    case 'TIMED':
    case 'SCHEDULED':      return { text: 'Planlandı', cls: 'text-muted' }
    default:               return { text: status, cls: 'text-muted' }
  }
}

export function isLive(status: string) {
  return ['IN_PLAY','PAUSED','HALFTIME','EXTRA_TIME','PENALTY_SHOOTOUT'].includes(status)
}
