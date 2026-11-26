import * as THREE from 'three'

export interface HeroMotionOptions {
  baseX: number
  baseY: number
  isWide: boolean
  scroll: number
  pointer: THREE.Vector2
  reducedMotion: boolean
}

/**
 * Applies linear scroll parallax alongside smooth mouse-pointer position and tilt movement
 * so the hero 3D centerpiece responds naturally to both scrolling and cursor motion.
 */
export function applyHeroMotion(
  group: THREE.Group,
  { baseX, baseY, isWide, scroll, pointer, reducedMotion }: HeroMotionOptions,
) {
  const pointerMoveX = reducedMotion ? 0 : pointer.x * (isWide ? 0.55 : 0.34)
  const pointerMoveY = reducedMotion ? 0 : pointer.y * (isWide ? 0.38 : 0.25)

  const targetX = baseX - scroll * (isWide ? 1.55 : 0) + pointerMoveX
  const targetY = baseY + scroll * 0.4 + pointerMoveY
  const targetZ = -scroll * 1.5

  group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 0.065)
  group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.065)
  group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, 0.065)

  if (reducedMotion) return

  const pointerRotX = -pointer.y * 0.38 + scroll * 0.5
  const pointerRotY = pointer.x * 0.52 + scroll * 0.9

  group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointerRotX, 0.065)
  group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerRotY, 0.065)
}
