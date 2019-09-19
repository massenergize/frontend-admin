import React from 'react';
import 'dan-styles/vendors/react-calculator/styles.css';
import ResultPanel from './ResultPanel';
import ButtonPanel from './ButtonPanel';

export default class Calculator extends React.Component {
  constructor() {
    super();
    this.state = {
      last: '',
      cur: '0'
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick(type) {
    let curVal = '';
    let lastLetter = '';
    const { cur } = this.state;
    switch (type) {
      case 'c':
        this.setState({
          last: '',
          cur: '0'
        });
        break;
      case 'back':
        this.setState({
          cur: cur === '0' ? cur : cur.slice(0, -1) || '0'
        });
        break;
      case '=':
        try {
          this.setState({
            last: cur + '=',
            cur: eval(cur) + '' // eslint-disable-line
          });
        } catch (e) {
          this.setState({
            last: cur + '=',
            cur: 'NaN'
          });
        }
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        curVal = cur;
        lastLetter = curVal.slice(-1);
        if (lastLetter === '+' || lastLetter === '-' || lastLetter === '*' || lastLetter === '/') {
          this.setState({
            cur: curVal.slice(0, -1) + type
          });
        } else {
          this.setState({
            cur: cur + type
          });
        }
        break;
      case '.':
        curVal = cur;
        lastLetter = curVal.slice(-1);
        if (lastLetter !== '.') {
          this.setState({
            cur: cur + type
          });
        }
        break;
      default:
        this.setState({
          cur: cur === '0' ? type : cur + type
        });
        break;
    }
  }

  render() {
    const { cur, last } = this.state;
    const exp = {
      cur,
      last
    };
    return (
      <div className="react-calculator" id="reactCalculator">
        <ResultPanel exp={exp} />
        <ButtonPanel onClick={this.onButtonClick} />
      </div>
    );
  }
}
