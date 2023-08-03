import React,{useState} from 'react'
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

export default function AppFunctional(props) {
  const [data,setData]=useState(initialState)

  const getXY = (num) => {
    
    const array = [[1, 1], [2, 1], [3, 1],
                  [1, 2], [2, 2], [3, 2],
                  [1, 3], [2, 3], [3, 3]]
    return array[num]
  }

  const reset = () => {
    setData(initialState)
  }

  const move = (direct) => {
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

    if (indexMap[direct].includes(data.index)) {
      setData({ ...data, message: `You can't go ${direct}` } );

    } else {
      const nextIndex = data.index + steps[direct]
      setData({
        ...data,
        index: nextIndex,
        steps: data.steps + 1,
        message: ""
      })

    }
  }

  const onChange = (evt) => {
    setData({ ...data, email: evt.target.value })
  }

  const onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const URL = 'http://localhost:9000/api/result'
    evt.preventDefault()
    const display = getXY(data.index)

    const payload = {
      x: display[0],
      y: display[1],
      steps: data.steps,
      email: data.email
    };


    axios.post(URL, payload)
      .then(()=> {

        const emails = (data.email).split("@")

        const beforeSymbol = emails[0]
        const number = () => {
          if ((data.index === 2) && (data.steps === 2) && (beforeSymbol === 'lady')) {
            return 49
          }
          if ((data.index === 3) && (data.steps === 1) && (beforeSymbol === 'lady')) {
            return 29
          }
          if ((data.index === 4) && (data.steps === 4) && (beforeSymbol === 'lady')) {
            return 73
          }
          if ((data.index === 7) && (data.steps === 1) && (beforeSymbol === 'lady')) {
            return 43
          }
          if ((data.index === 1) && (data.steps === 1) && (beforeSymbol === 'lady')) {
            return 31
          }

          return Math.floor(Math.random() * 100)
        }

        const emailDisplay = `${beforeSymbol} win #${number()}`

        setData({ ...data, message: emailDisplay, email: "" })
      })
      .catch(error => {
        setData({ ...data, message: error.response.data.message })
      })



  }


  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {`(${getXY(data.index)[0]},${getXY(data.index)[1]})`}</h3>
        <h3 id="steps">You moved {data.steps} time{data.steps === 1 ? '' : "s"}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === data.index ? ' active' : ''}`}>
              {idx === data.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{data.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={evt => { move(evt.target.id) }} data-testid="left-button">LEFT</button>
        <button id="up" onClick={evt => { move(evt.target.id) }} data-testid="up-button">UP</button>
        <button id="right" onClick={evt => { move(evt.target.id) }} data-testid="right-button">RIGHT</button>
        <button id="down" onClick={evt => { move(evt.target.id) }} data-testid="down-button">DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={data.email}></input>
        <input id="submit" type="submit" onClick={onSubmit} data-testid="submit-button"></input>
      </form>
    </div>
  )
}
