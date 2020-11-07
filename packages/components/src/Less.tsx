import React, { useEffect, useRef, useState } from "react";
import { useMeasure } from "use-item-size";
import useForceUpdate from "use-force-update";

import styles from "./Less.module.scss";

type Props = {
  id?: string;
  children: any;
  width?: number;
  less?: any;
  more?: any;
  maxHeight: number | string;
};

const Less: React.FC<Props> = ({
  id,
  children,
  width,
  maxHeight,
  less = <span className={styles.btn}>&nbsp;less</span>,
  more = <span className={styles.btn}>... more</span>,
}) => {
  const [expanded, setExpanded] = useState(false);
  const mem = useRef<number | undefined>(undefined);
  const refresh = useForceUpdate();
  const measure = useMeasure({ id, width });

  if (!mem.current) {
    const height = measure(children);
    mem.current = height;
  }

  useEffect(() => {
    mem.current = undefined;
    refresh();
  }, [id, children, width, refresh]);

  const isSmall = mem.current < maxHeight;
  const toggle = () => setExpanded(!expanded);
  const style =
    isSmall || expanded
      ? {}
      : { maxHeight, display: "inline-block", overflow: "hidden" };

  return (
    <span>
      <span style={style}>{children}</span>
      {isSmall ? null : <span onClick={toggle}>{expanded ? less : more}</span>}
    </span>
  );
};

export default Less;
