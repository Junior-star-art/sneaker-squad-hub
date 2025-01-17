declare module 'react-pull-to-refresh' {
  import { ReactNode } from 'react';

  export interface ReactPullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
    distanceToRefresh?: number;
    resistance?: number;
    hammerOptions?: any;
    style?: React.CSSProperties;
    className?: string;
  }

  export default function PullToRefresh(props: ReactPullToRefreshProps): JSX.Element;
}