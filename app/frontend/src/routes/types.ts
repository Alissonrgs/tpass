interface IComponent {
  routes: IRoute[];
}

export interface IRoute {
  component: React.FC<IComponent>,
  exact: boolean,
  path: string,
  routes: IRoute[]
}