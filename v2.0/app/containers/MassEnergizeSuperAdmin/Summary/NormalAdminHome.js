import React, { Component } from 'react'

class NormalAdminHome extends Component {
  constructor(props) {
    super(props)

    this.state = {
         
    }
  }

  render() {
    return (
      <div>
        <h1>Hi I am an admin</h1>
        <button onClick = {()=>{this.props.signOut()}}>Sign out</button>
      </div>
    )
  }
}

export default NormalAdminHome
