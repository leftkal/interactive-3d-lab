import { Maximize2, MousePointer2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

export function StlViewer({ src, label }: { src: string; label: string }) {
  const mount = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const element = mount.current
    if (!element) return
    setStatus('loading')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 2000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xf8fbff, 0)
    renderer.shadowMap.enabled = true
    // Keep the CSS canvas equal to its container. Without this, Retina screens
    // lay out the high-DPI drawing buffer at double size and clip its centre.
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    element.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 20
    controls.maxDistance = 600
    scene.add(new THREE.HemisphereLight(0xffffff, 0x45658a, 2.4))
    const light = new THREE.DirectionalLight(0xffffff, 3.2)
    light.position.set(80, 100, 120)
    light.castShadow = true
    scene.add(light)
    const fill = new THREE.DirectionalLight(0x9adff7, 1.6)
    fill.position.set(-90, 25, -80)
    scene.add(fill)
    let mesh: THREE.Mesh | undefined
    let frame = 0
    let fitCamera: (() => void) | undefined
    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      fitCamera?.()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()
    new STLLoader().load(src, (geometry) => {
      geometry.computeVertexNormals()
      geometry.center()
      geometry.computeBoundingBox()
      const material = new THREE.MeshStandardMaterial({ color: 0x159fd3, metalness: 0.14, roughness: 0.34 })
      mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.rotation.x = -0.38
      scene.add(mesh)
      // Frame the actual, rotated mesh from its centre. Re-run on viewport changes.
      fitCamera = () => {
        if (!mesh) return
        const bounds = new THREE.Box3().setFromObject(mesh)
        const center = bounds.getCenter(new THREE.Vector3())
        const size = bounds.getSize(new THREE.Vector3())
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
        const distanceForHeight = (size.y / 2) / Math.tan(halfFov)
        const distanceForWidth = (size.x / 2) / (Math.tan(halfFov) * camera.aspect)
        const distance = Math.max(distanceForHeight, distanceForWidth, size.z) * 1.6
        camera.position.set(center.x, center.y, center.z + distance)
        camera.near = Math.max(0.01, distance / 100)
        camera.far = distance * 100
        camera.updateProjectionMatrix()
        controls.target.copy(center)
        controls.minDistance = distance * 0.4
        controls.maxDistance = distance * 4
        controls.update()
      }
      fitCamera()
      setStatus('ready')
    }, undefined, () => setStatus('error'))
    const render = () => {
      frame = requestAnimationFrame(render)
      controls.update()
      renderer.render(scene, camera)
    }
    render()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      mesh?.geometry.dispose()
      if (mesh?.material instanceof THREE.Material) mesh.material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [src])

  return <div className="relative h-[340px] overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-violet/5 sm:h-[420px]" aria-label={`Τρισδιάστατη προβολή: ${label}`}>
    <div ref={mount} className="h-full w-full" />
    {status === 'loading' && <div className="absolute inset-0 grid place-items-center bg-white/75 text-sm font-bold text-slate-500">Φόρτωση τρισδιάστατου μοντέλου…</div>}
    {status === 'error' && <div className="absolute inset-0 grid place-items-center bg-white/85 p-6 text-center text-sm font-bold text-slate-600">Δεν ήταν δυνατή η φόρτωση του μοντέλου.</div>}
    {status === 'ready' && <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm"><MousePointer2 size={15} className="text-cyan" />Σύρε για περιστροφή · κύλησε για zoom <Maximize2 size={14} className="ml-1 text-violet" /></div>}
  </div>
}
