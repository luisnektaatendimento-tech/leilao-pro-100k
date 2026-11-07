import type { Scene } from '../../lib/scenes'
import { Chapter, Cover, Discount } from './Opening'
import { Property, Ruler } from './Market'
import { Compare, Composition, Financing, Period, Profit } from './Numbers'
import { Conclusion, Validation } from './Closing'

/** Escolhe o componente certo para cada tipo de cena. */
export default function SceneView({ scene, complete }: { scene: Scene; i: number; complete: boolean }) {
  switch (scene.kind) {
    case 'cover':
      return <Cover />
    case 'discount':
      return <Discount />
    case 'chapter':
      return <Chapter scene={scene} />
    case 'property':
      return <Property />
    case 'ruler':
      return <Ruler />
    case 'composition':
      return <Composition />
    case 'financing':
      return <Financing />
    case 'period':
      return <Period />
    case 'compare':
      return <Compare />
    case 'profit':
      return <Profit />
    case 'validation':
      return <Validation />
    case 'conclusion':
      return <Conclusion complete={complete} />
  }
}
