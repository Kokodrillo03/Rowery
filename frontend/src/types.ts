export interface Route {
  id: number
  image: string
  title: string
  description: string
  username?: string
  userImage?: string
  wayPoints?: number[][]
  route?: number[][]
}
