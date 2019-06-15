import React from 'react';
import PropTypes from 'prop-types';

class ButtonPanel extends React.Component {
  constructor() {
    super();
    this.keyMapping = {};
    this.Btn = [];
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    let buttons = this.Btn;
    buttons = [].slice.call(buttons);
    buttons.forEach((button) => {
      this.keyMapping[button.dataset.code] = button;
    });
    const calculatorELem = document.getElementById('reactCalculator');
    calculatorELem.onkeydown = (event) => {
      const key = (event.shiftKey ? 'shift+' : '') + event.keyCode || event.which;
      const button = this.keyMapping[key];
      if (button) {
        button.click();
        event.stopPropagation();
        event.preventDefault();
      }
    };
  }

  onClick(e) {
    const { onClick } = this.props;
    onClick(e.target.dataset.value);
  }

  render() {
    return (
      <div className="button-panel rowx">
        <div className="s3 column">
          <div className="s1 rowx">
            <button type="button" className="button s1" ref={(input) => { this.Btn[0] = input; }} data-code="67" data-value="c" onClick={this.onClick}>C</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[1] = input; }} data-code="8" data-value="back" onClick={this.onClick}>←</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[2] = input; }} data-code="191" data-value="/" onClick={this.onClick}>÷</button>
          </div>
          <div className="s1 rowx">
            <button type="button" className="button s1" ref={(input) => { this.Btn[3] = input; }} data-code="55" data-value="7" onClick={this.onClick}>7</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[4] = input; }} data-code="56" data-value="8" onClick={this.onClick}>8</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[5] = input; }} data-code="57" data-value="9" onClick={this.onClick}>9</button>
          </div>
          <div className="s1 rowx">
            <button type="button" className="button s1" ref={(input) => { this.Btn[6] = input; }} data-code="52" data-value="4" onClick={this.onClick}>4</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[7] = input; }} data-code="53" data-value="5" onClick={this.onClick}>5</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[8] = input; }} data-code="54" data-value="6" onClick={this.onClick}>6</button>
          </div>
          <div className="s1 rowx">
            <button type="button" className="button s1" ref={(input) => { this.Btn[9] = input; }} data-code="49" data-value="1" onClick={this.onClick}>1</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[10] = input; }} data-code="50" data-value="2" onClick={this.onClick}>2</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[11] = input; }} data-code="51" data-value="3" onClick={this.onClick}>3</button>
          </div>
          <div className="s1 rowx">
            <button type="button" className="button s2" ref={(input) => { this.Btn[12] = input; }} data-code="48" data-value="0" onClick={this.onClick}>0</button>
            <button type="button" className="button s1" ref={(input) => { this.Btn[13] = input; }} data-code="190" data-value="." onClick={this.onClick}>.</button>
          </div>
        </div>
        <div className="s1 column">
          <button type="button" className="button s1" ref={(input) => { this.Btn[14] = input; }} data-code="shift+56" data-value="*" onClick={this.onClick}>×</button>
          <button type="button" className="button s1" ref={(input) => { this.Btn[15] = input; }} data-code="189" data-value="-" onClick={this.onClick}>-</button>
          <button type="button" className="button s1" ref={(input) => { this.Btn[16] = input; }} data-code="shift+187" data-value="+" onClick={this.onClick}>+</button>
          <button type="button" className="button s2 button-equal" ref={(input) => { this.Btn[17] = input; }} data-code="13" data-value="=" onClick={this.onClick}>=</button>
        </div>
      </div>
    );
  }
}

ButtonPanel.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ButtonPanel;
