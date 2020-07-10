import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'

import Jumbotron from 'react-bootstrap/Jumbotron'

export default class Homepage extends Component {

  render() {
    return (
      <div className="homepage">
        <Jumbotron className="shadow border-0 rounded-0 bg-secondary text-light">
          <Container>
            <h1 className="mb-5">
              RBAC //TODO app
            </h1>
          </Container>
        </Jumbotron>

        <Container>
        </Container>
      </div>
    )
  }

}
