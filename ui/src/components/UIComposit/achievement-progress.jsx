import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import 'antd/dist/antd.css';

function AchievementProgressCircle(props) {
  // const COMPLETEDACHIEVEMENTS = props.achievementsCompleted;
  const COMPLETEDACHIEVEMENTS = props.achievementStatus;

  const TOTALACHIEVEMENTS = props.achievementTotal;

  const COMPLETEDPERCENT = (COMPLETEDACHIEVEMENTS / TOTALACHIEVEMENTS) * 100;
  console.log('completedAchievements', COMPLETEDACHIEVEMENTS);
  return (
    <Progress strokeLinecap='square' type='circle' percent={COMPLETEDPERCENT} />
  );
}

export default AchievementProgressCircle;
