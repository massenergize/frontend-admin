import React from 'react';
import newsData from 'dan-api/dummy/newsData';
import Typography from '@mui/material/Typography';
import FlashOn from '@mui/icons-material/FlashOn';
import HorizontalNewsCard from '../CardPaper/HorizontalNewsCard';

class NewsListWidget extends React.Component {
  render() {
    return (
      <div>
        <Typography gutterBottom variant="h5">
          <FlashOn />
          &nbsp;News Flash
        </Typography>
        {
          newsData.map((item, index) => (
            <div key={index.toString()}>
              <HorizontalNewsCard title={item.title} desc={item.desc} thumbnail={item.thumb} />
            </div>
          ))
        }
      </div>
    );
  }
}

export default NewsListWidget;
