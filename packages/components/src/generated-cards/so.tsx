
// warning: this file is auto generated
import React from "react";
import DataCard, { StatelessCard } from "../DataCard";

const DATA = undefined;

const StaticCard = () => {
  const Card = DATA ? StatelessCard : DataCard;
  return <Card text="so" lang="en" data={DATA}/>;
};

export default StaticCard;
