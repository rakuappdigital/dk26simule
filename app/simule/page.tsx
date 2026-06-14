export const metadata = {
  title: 'Simülatör — DK26 Simüle',
  description: '2026 FIFA Dünya Kupası grubunu, elemeleri ve şampiyonu kendin simüle et.',
}

export default function SimulePage() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      <iframe
        src="/simulator.html"
        className="flex-1 w-full border-0"
        title="WC2026 Simülatörü"
        allow="accelerometer"
      />
    </div>
  )
}
