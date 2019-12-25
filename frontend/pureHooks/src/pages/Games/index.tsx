import * as React from 'react';
import { Card, Tooltip } from 'antd';

import './games.less';

import gamesData from './data';

const { Meta } = Card;

interface Props {
  routes: object[];
}

class Games extends React.Component<Props> {
  public render() {
    return (
      <div className="games">
        <div className="content">
          {gamesData.map(({ name, desc, cover }, index) => (
            <Card key={index} className="game_card" title={name} cover={<img src={cover} />}>
              <Meta
                description={
                  <Tooltip placement="rightTop" className="desc" title={desc}>
                    {desc}
                  </Tooltip>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    );
  }
}

export default Games;
