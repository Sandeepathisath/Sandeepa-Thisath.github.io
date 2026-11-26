import * as THREE from 'three'

export interface HeroMotionOptions {
  baseX: number
  baseY: number
  isWide: boolean
  scroll: number
  elapsed: number
  pointer: THREE.Vector2
  reducedMotion: boolean
}

/**
 * Applies linear scroll parallax, gentle autonomous ambient motion (when idle),
 * and smooth mouse-pointer position and tilt movement across all hero 3D centerpieces.
 */
export function applyHeroMotion(
  group: THREE.Group,
  { baseX, baseY, isWide, scroll, elapsed, pointer, reducedMotion }: HeroMotionOptions,
) {
  const idleDriftX = reducedMotion ? 0 : Math.sin(elapsed * 0.58) * (isWide ? 0.14 : 0.1)
  const idleDriftY = reducedMotion ? 0 : Math.sin(elapsed * 0.78) * 0.12
  const pointerMoveX = reducedMotion ? 0 : pointer.x * (isWide ? 0.55 : 0.34)
  const pointerMoveY = reducedMotion ? 0 : pointer.y * (isWide ? 0.38 : 0.25)

  const targetX = baseX - scroll * (isWide ? 1.55 : 0) + idleDriftX + pointerMoveX
  const targetY = baseY + scroll * 0.4 + idleDriftY + pointerMoveY
  const targetZ = -scroll * 1.5

  group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 0.075)
  group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.075)
  group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, 0.075)

  if (reducedMotion) return

  const idleRotX = Math.sin(elapsed * 0.52) * 0.11
  const idleRotY = Math.cos(elapsed * 0.45) * 0.15
  const pointerRotX = -pointer.y * 0.38 + scroll * 0.5 + idleRotX
  const pointerRotY = pointer.x * 0.52 + scroll * 0.9 + idleRotY

  group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointerRotX, 0.075)
  group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerRotY, 0.075)
}
