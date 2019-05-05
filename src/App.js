import React, { Component} from 'react';
import './App.css';

function range(start, end) {
  if(start === end) return [start];
  return [start, ...range(start + 1, end)];
}

class App extends Component {
  state = {
    'draw_orig': '1-9',
    'exclude_orig': '',
    'draw_numbers': [],
    'draw_number': null,
    'isRunning': false,
    'intarval': null,
  }

  generate_draw_numbers = () => {
    let draw_numbers = new Set()
    const { draw_orig, exclude_orig } = this.state
    let exclude_numbers = new Set()
    exclude_orig.split(',').map(num => {
      if (num) {
        exclude_numbers.add(parseInt(num))
      }  
    })
    draw_orig.split(',').map(num => {
      if (num.includes('-')) {
        const begin = num.split('-')[0]
        const end = num.split('-')[1]
        range(parseInt(begin), parseInt(end)).map(newNum => {
          if (!exclude_numbers.has(newNum)) {
            draw_numbers.add(newNum)
          }
        })
      } else {
        num = parseInt(num)
        if (!exclude_numbers.has(num))
        draw_numbers.add(num)
      }
    })
    draw_numbers = Array.from(draw_numbers)
    this.setState({draw_numbers})
  }

  generate_draw_number = () => {
    const { draw_numbers } = this.state
    let draw_number = draw_numbers[Math.floor(Math.random() * draw_numbers.length)]
    this.setState({draw_number})
  }

  handleChange = (event) => {
    const name = event.target.name
    this.setState({
      [name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    
    if (!this.state.isRunning) {
      this.generate_draw_numbers()
      this.setState({ interval: setInterval(this.generate_draw_number, 100)})
      this.setState({ isRunning: true })
    } else {
      if (this.state.interval) {
        clearInterval(this.state.interval)
        this.setState({ interval: null })
      }
      this.setState({ isRunning: false })
    }
  }

  render() {
    return (
      <div className="App">
        <form className="box" onSubmit={this.handleSubmit}>
          <label>
            请输入抽奖号码,以英文逗号(,)分割,如果是连续数字,可以使用'-'(如'1-9,11'): <br />
            <input type="text" name="draw_orig" defaultValue={this.state.draw_orig} onChange={this.handleChange} />
          </label>   
          <br />
          <label>
            请输入需要排除的抽奖号码,以英文逗号(,)分割 <br />
            <input type="text" name="exclude_orig" defaultValue={this.state.exclude_orig} onChange={this.handleChange} />
          </label>   
          <br /> <br />
          <button type="submit">{ (!this.state.isRunning) ? '开始' : '停止'}</button>
        </form>
        <hr />
        <h1>{ (this.state.draw_number === null) ? '' : this.state.draw_number }</h1>
      </div>
    )
  }  
}

export default App;
