export interface Route {
  _id: string
  image: string
  title: string
  description: string
  username?: string
  userImage?: string
  wayPoints?: number[][]
  route?: number[][]
}
