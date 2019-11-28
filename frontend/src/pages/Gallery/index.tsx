import React, { useState, useEffect } from 'react';
import './gallery.less';

function Bus() {
  const [count] = useState<number>(0);

  useEffect(() => {
    document.title = `You Clicked ${count} times`;
  });

  return (
    <div className="gallery">
      {/* 头部 */}
      <div className="header" />

      {/* 封面list */}
      <div className="cover_list">
        {/* 封面 */}
        <div className="cover">
          {/* 封面内蒙版  按钮 */}
          <div className="content">
            {/* 查看按钮 */}
            <div className="link">view</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Bus;
