
import type { Notify } from "./types";
import { useNotifications } from "./useNotifications";

export type WithNotificationsProps = { notify: Notify };

export const withNotifications = <P extends object>(
  Component: React.ComponentType<P & WithNotificationsProps>
) => {
  return function Wrapped(props: P) {
    const notify = useNotifications();
    return <Component {...props} notify={notify} />;
  };
};
