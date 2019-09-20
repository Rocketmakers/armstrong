import * as React from "react";
import * as _ from "underscore";
import { ClassHelpers, Icon } from "../..";

type RefreshStatus = "required" | "refreshing" | "idle";

export interface IDataListProps {
  /** The maximum distance in pixels you can pull down from the top of the list */
  maxDistance?: number;
  /** The distance in pixels you need to pull down before triggering the refresh action */
  refreshThreshold?: number;
  /** An artifical delay in milliseconds after fetching, useful for fast or local queries */
  postRefreshDelayMs?: number;
  /** Wether or not the list should be in the 'refreshing' state */
  refreshing?: boolean;
  /** If true, the list items won't be rendered while refreshing */
  hideChildrenWhileRefreshing?: boolean;
  /** The function to call to refresh your data */
  refreshData: () => void;
  /** A custom react component to show while refreshing */
  refreshingComponent?: JSX.Element;
  /** Skips showing refreshing UI for first fetch */
  skipFirstFetch?: boolean;
}

export const DataList: React.FunctionComponent<IDataListProps> = props => {
  const [firstFetchComplete, setFirstFetchComplete] = React.useState(false);

  const [dragStartY, setDragStartY] = React.useState(null);
  const [dragDeltaY, setDragDeltaY] = React.useState(0);
  const [scrollOffsetY, setscrollOffsetY] = React.useState(0);

  const [refreshStatus, setrefreshStatus] = React.useState<RefreshStatus>(
    "idle",
  );

  const handleDragStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (refreshStatus === "refreshing") {
      return;
    }
    setDragStartY(e.touches[0].clientY + scrollOffsetY);
  };

  const handleDragEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragDeltaY(0);
    setDragStartY(null);
    runRefresh();
  };

  const runRefresh = (force?: boolean) => {
    if (refreshStatus === "required" || force) {
      props.refreshData();
      setrefreshStatus("refreshing");
    }
  };

  const handleDragMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (refreshStatus === "refreshing") {
      return;
    }
    if (dragStartY !== null) {
      const delta = dragStartY - e.touches[0].clientY;
      if (delta < 10 && scrollOffsetY === 0) {
        setDragDeltaY(Math.max(delta, -props.maxDistance));
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = (e.target as HTMLDivElement).scrollTop;
    setscrollOffsetY(top);
  };

  React.useEffect(() => {
    if (dragDeltaY > -props.refreshThreshold) {
      if (refreshStatus === "required") {
        setrefreshStatus("idle");
      }
    } else {
      if (refreshStatus !== "required") {
        setrefreshStatus("required");
      }
    }
  }, [dragDeltaY, props.refreshThreshold, refreshStatus]);

  React.useEffect(() => {
    if (props.refreshing) {
      if (!firstFetchComplete && props.skipFirstFetch) {
        setFirstFetchComplete(true);
        return;
      }
      setrefreshStatus("refreshing");
    } else {
      window.setTimeout(() => {
        setrefreshStatus("idle");
      }, props.postRefreshDelayMs);
    }
  }, [props.refreshing]);

  const calculatePullPercentage = React.useCallback(() => {
    if (refreshStatus === "refreshing") {
      return 100;
    }
    const op =
      Math.min(props.refreshThreshold, -dragDeltaY) *
      (props.maxDistance / props.refreshThreshold);
    return op;
  }, [
    props.refreshThreshold,
    dragDeltaY,
    props.maxDistance,
    refreshStatus,
    props.refreshThreshold,
  ]);

  const calculateTransformValue = React.useCallback(() => {
    if (dragDeltaY >= 0 && refreshStatus === "idle") {
      return 0;
    }
    if (refreshStatus === "refreshing") {
      return 50;
    }
    return -Math.max(dragDeltaY, -props.maxDistance);
  }, [dragDeltaY, props.maxDistance, refreshStatus]);

  // This stops iOS safaris bounce effect :(
  React.useEffect(() => {
    document.querySelector("html").classList.add("force-fixed");
    return () => document.querySelector("html").classList.remove("force-fixed");
  }, []);

  return (
    <div
      className={ClassHelpers.classNames("data-list-container", refreshStatus)}
    >
      <div
        className="refresh-indicator"
        style={{
          opacity: calculatePullPercentage() / 100,
          height: `${calculateTransformValue()}px`,
        }}
      >
        {!props.refreshingComponent && (
          <>
            <Icon icon={Icon.Icomoon.spinner3} />
            {refreshStatus === "idle" && "Pull to refresh"}
            {refreshStatus === "required" && "Let go to refresh"}
            {refreshStatus === "refreshing" && "Refreshing"}
          </>
        )}
        {props.refreshingComponent}
      </div>
      <div
        style={{ transform: `translateY(${calculateTransformValue()}px)` }}
        className={ClassHelpers.classNames(
          "data-list",
          { dragging: dragStartY !== null },
          { "hide-flow": Math.round(dragDeltaY) < 0 },
        )}
        onScroll={handleScroll}
        onTouchMove={handleDragMove}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {(refreshStatus !== "refreshing" ||
          (refreshStatus === "refreshing" &&
            !props.hideChildrenWhileRefreshing)) &&
          props.children}
      </div>
    </div>
  );
};

DataList.defaultProps = {
  maxDistance: 100,
  refreshThreshold: 50,
  postRefreshDelayMs: 1000,
  hideChildrenWhileRefreshing: false,
  skipFirstFetch: true,
};
