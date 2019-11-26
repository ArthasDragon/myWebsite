import * as React from 'react';
import { Card, Tooltip } from 'antd';

import './games.less';

const { Meta } = Card;

const taiwu = require('@/assets/imgs/scrollOfTaiWu.jpg');

interface Props {
  routes: object[];
}

class Home extends React.Component<Props> {
  public render() {
    return (
      <div className="games">
        <header>games</header>
        <div className="content">
          <Card className="game_card" cover={<img src={taiwu} />}>
            <Meta
              description={
                <Tooltip
                  placement="rightTop"
                  className="desc"
                  title="在《太吾绘卷》的世界中，你除了需要扮演神秘的“太吾氏传人”，还将以不同的处世立场——或善、或恶、或中庸——投身于纷繁复杂的江湖之中。你不仅可以拜访世界各地的武林门派，学习种类繁多的功法绝艺；还可以与人义结金兰，或结下血海深仇；不仅可以兴建自己的村庄，经营各种产业；还可以与自己的挚爱生儿育女，缘定三生；直到你终于面对太吾氏的宿敌，决定世界的命运！"
                >
                  在《太吾绘卷》的世界中，你除了需要扮演神秘的“太吾氏传人”，还将以不同的处世立场——或善、或恶、或中庸——投身于纷繁复杂的江湖之中。你不仅可以拜访世界各地的武林门派，学习种类繁多的功法绝艺；还可以与人义结金兰，或结下血海深仇；不仅可以兴建自己的村庄，经营各种产业；还可以与自己的挚爱生儿育女，缘定三生；直到你终于面对太吾氏的宿敌，决定世界的命运！
                </Tooltip>
              }
            />
          </Card>
          <Card className="game_card" cover={<img src={taiwu} />}>
            <Meta description="This is the description" />
          </Card>
          <Card className="game_card" cover={<img src={taiwu} />}>
            <Meta description="This is the description" />
          </Card>
        </div>
      </div>
    );
  }
}

export default Home;
