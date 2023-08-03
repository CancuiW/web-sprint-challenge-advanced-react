import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  
  //initialState={message:"",email:"",index:4,steps:0}
  state = initialState 

  getXY = (num) => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const array = [[1, 1],[2, 1], [3, 1],
                   [1, 2], [2, 2], [3, 2],
                   [1, 3], [2, 3], [3, 3]]
    return array[num]          
  }

  
  reset = () => {
    this.setState(initialState )
  }

  
  move = (direct) => {
    //indexMap stores the indexes about edge squares 
    //eg: if index===0,index as the same,but the message will change
    const indexMap = {
      left: [0, 3, 6],
      right: [2, 5, 8],
      up: [0, 1, 2],
      down: [6, 7, 8],
    };
    const steps = {
      left: -1,
      right: 1,
      up: -3,
      down: 3,
    };

    if (indexMap[direct].includes(this.state.index)){
      this.setState({...this.state,message: `You can't go ${direct}`});

    }else{
      const nextIndex = this.state.index+steps[direct]
      this.setState({...this.state, 
                     index: nextIndex,
                     steps: this.state.steps+1,
                     message: ""
        })
                      
    }
      
  }

  onChange = (evt) => {
    
    
    this.setState({...this.state,email:evt.target.value})
    
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const URL = 'http://localhost:9000/api/result'
    evt.preventDefault()
    const display = this.getXY(this.state.index)
    
    
    const payload = {
       x: display[0],
      y: display[1],
      steps: this.state.steps,
      email: this.state.email
    };

    
    //{ message: this.state.email }
    axios.post(URL, payload)
      .then(() => {
        
        const email = (this.state.email).split("@")
        const beforeSymbol=email[0]
        
        const emailDisplay = `${beforeSymbol} win #${Math.floor(Math.random() * 100) }`
       
        this.setState({ ...this.state, message: emailDisplay })
      })
      .catch(error=>{
        this.setState({ ...this.state, message: error.response.data.message })
      })



  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {`(${this.getXY(this.state.index)[0]},${this.getXY(this.state.index)[1] })`}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          {/* {evt => { this.move(evt.target.id) } firstly get the id(left) to the move()function } */}
          <button id="left" onClick={evt => { this.move(evt.target.id) }}>LEFT</button>
          <button id="up" onClick={evt => { this.move(evt.target.id) }}>UP</button>
          <button id="right" onClick={evt => { this.move(evt.target.id) }}>RIGHT</button>
          <button id="down" onClick={evt => { this.move(evt.target.id) }}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange}></input>
          <input id="submit" type="submit" onClick={this.onSubmit}></input>
        </form>
      </div>
    )
  }
}
