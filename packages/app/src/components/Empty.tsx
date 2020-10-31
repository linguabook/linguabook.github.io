import React from "react";
import styles from "./Empty.module.scss";

const Empty: React.FC<{}> = () => (
  <div className={styles.empty}>Nothing to show</div>
);

export default Empty;
