/** Caminho de um arquivo de /public respeitando o `base` do build ('/' na Vercel, './' fora dela). */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')
