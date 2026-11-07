import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { rig } from './rig'

/* Simplex noise 2D (Ashima / Stefan Gustavson, MIT) */
const NOISE = /* glsl */ `
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*snoise(p); p*=2.03; a*=0.5; } return s; }
`

const terrainVert = /* glsl */ `
uniform float uTime;
varying float vH;
varying vec3 vWorld;
${NOISE}
void main(){
  vec3 p = position;
  float h = fbm(p.xy * 0.055 + vec2(uTime * 0.006, -uTime * 0.004));
  h += 0.35 * snoise(p.xy * 0.018);
  p.z = h * 3.2;
  vH = h;
  vec4 w = modelMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

const terrainFrag = /* glsl */ `
uniform vec3 uAccent;
uniform vec3 uCam;
uniform vec2 uFocus;
uniform float uCelebrate;
uniform float uTime;
varying float vH;
varying vec3 vWorld;
void main(){
  float k = vH * 9.0;
  float f = fract(k);
  float w = fwidth(k);
  float line = 1.0 - smoothstep(0.0, w * 1.15, min(f, 1.0 - f));
  // linha mestra a cada 5 curvas
  float km = vH * 1.8;
  float fm = fract(km);
  float wm = fwidth(km);
  float major = 1.0 - smoothstep(0.0, wm * 1.4, min(fm, 1.0 - fm));

  float dist = length(vWorld - uCam);
  float fog = 1.0 - smoothstep(10.0, 46.0, dist);

  vec3 base = vec3(0.93, 0.918, 0.894);
  float a = (line * 0.075 + major * 0.11) * fog;

  // brilho de acento perto do foco da câmera
  float d = length(vWorld.xz - uFocus);
  float glow = (1.0 - smoothstep(0.0, 11.0, d)) * 0.55;

  // onda de celebração
  float r = uCelebrate * 42.0;
  float ring = (1.0 - smoothstep(0.0, 2.6, abs(d - r))) * uCelebrate * (1.0 - uCelebrate * 0.6);
  vec3 col = mix(base, uAccent, clamp(glow * line + ring * 1.4, 0.0, 1.0));
  a += ring * 0.35 * (line + major) * fog;
  gl_FragColor = vec4(col, a);
}
`

const pointsVert = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSeed;
varying float vA;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.15 + aSeed * 6.283) * 0.6;
  p.x += cos(uTime * 0.1 + aSeed * 12.0) * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPx * (0.6 + aSeed) * (18.0 / -mv.z);
  vA = (0.25 + 0.5 * aSeed) * (1.0 - smoothstep(14.0, 40.0, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`
const pointsFrag = /* glsl */ `
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(0.93, 0.918, 0.894, a * vA);
}
`

const tmpTarget = new THREE.Vector3()
const lookAt = new THREE.Vector3(0, 0, -8)
const accentV = new THREE.Vector3()

function Terrain() {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccent: { value: new THREE.Vector3(...rig.accent) },
      uCam: { value: new THREE.Vector3() },
      uFocus: { value: new THREE.Vector2() },
      uCelebrate: { value: 0 },
    }),
    [],
  )
  const geo = useMemo(() => new THREE.PlaneGeometry(110, 80, 220, 160), [])
  useFrame(({ clock, camera }) => {
    const u = mat.current.uniforms
    u.uTime.value = clock.elapsedTime
    u.uCam.value.copy(camera.position)
    u.uAccent.value.lerp(accentV.set(...rig.accent), 0.05)
    u.uFocus.value.set(lookAt.x, lookAt.z)
    u.uCelebrate.value += (rig.celebrate - u.uCelebrate.value) * 0.02
  })
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -10]}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={terrainVert}
        fragmentShader={terrainFrag}
        transparent
        depthWrite={false}
        extensions={{ derivatives: true } as never}
      />
    </mesh>
  )
}

function Dust({ count = 520 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const { gl } = useThree()
  const [geo] = useState(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70
      pos[i * 3 + 1] = Math.random() * 14 - 1
      pos[i * 3 + 2] = -Math.random() * 40 + 8
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  })
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPx: { value: gl.getPixelRatio() * 1.6 } }), [gl])
  useFrame(({ clock }) => {
    mat.current.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <points geometry={geo}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={pointsVert} fragmentShader={pointsFrag} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}


function CameraRig() {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0015, dt) // suavização independente de fps
    let x: number, y: number, z: number, lx: number, ly: number, lz: number
    if (rig.mode === 'home') {
      x = rig.mouse.x * 1.4
      y = 6.2 - rig.mouse.y * 0.7 - rig.dive * 3.2
      z = 15 - rig.dive * 10
      lx = rig.mouse.x * 0.6
      ly = -0.5 - rig.dive * 1.5
      lz = -8
    } else {
      const p = rig.progress
      x = -16 + p * 32 + rig.mouse.x * 0.5
      y = 4.4 - rig.mouse.y * 0.3 - Math.sin(p * Math.PI) * 0.8
      z = 9
      lx = x + 3
      ly = -0.8
      lz = -9
    }
    camera.position.lerp(tmpTarget.set(x, y, z), k)
    lookAt.lerp(tmpTarget.set(lx, ly, lz), k)
    camera.lookAt(lookAt)
  })
  return null
}


export default function Backdrop() {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 120, position: [0, 6, 15] }}
      onCreated={({ gl }) => gl.setClearColor('#0A0A0B')}
      aria-hidden
    >
      <CameraRig />
      <Terrain />
      <Dust />
    </Canvas>
  )
}
