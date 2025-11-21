export function getTimeSlots(startHour: number, endHour: number, intervalMinutes: number = 30): string[] {
  const slots: string[] = []
  let currentHour = startHour

  while (currentHour < endHour) {
    const hour = String(currentHour).padStart(2, '0')
    slots.push(`${hour}:00`)
    slots.push(`${hour}:30`)
    currentHour += 1
  }

  return slots.filter((slot) => {
    const [h] = slot.split(':').map(Number)
    return h < endHour
  })
}

export function isTimeAvailable(
  requestedStart: string,
  requestedEnd: string,
  bookings: Array<{ start_time: string; end_time: string }>,
  blockedTimes: Array<{ start_time: string; end_time: string }>
): boolean {
  const isConflicting = (start1: string, end1: string, start2: string, end2: string) => {
    return start1 < end2 && end1 > start2
  }

  for (const booking of bookings) {
    if (isConflicting(requestedStart, requestedEnd, booking.start_time, booking.end_time)) {
      return false
    }
  }

  for (const blocked of blockedTimes) {
    if (isConflicting(requestedStart, requestedEnd, blocked.start_time, blocked.end_time)) {
      return false
    }
  }

  return true
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMins = totalMinutes % 60

  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`
}
