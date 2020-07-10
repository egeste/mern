import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'

import Container from 'react-bootstrap/Container'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import Badge from 'react-bootstrap/Badge'
import Image from 'react-bootstrap/Image'

import LogoutLink from '../Session/LogoutLink'

import { connect } from 'react-redux'
import rbac from '../../lib/rbac'

import './App.scss'

export default connect(state => ({
  session: state.session.session
}))(class AppLayout extends Component {

  render() {
    const { session } = this.props

    return (
      <div className="app-layout">

        <Navbar bg="primary" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to="/">
            RBAC //TODO app
          </Navbar.Brand>

          <Navbar.Toggle/>

          <Navbar.Collapse>
            <Nav className="w-100">
              { rbac.can(session.user.role).readAny('admin').granted ? (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              ) : null }

              { rbac.can(session.user.role).deleteOwn('session').granted ? (
                <Fragment>
                  <NavDropdown drop="left"
                    className="d-none d-lg-block ml-auto"
                    title={(
                      <Fragment>
                        <Badge pill variant="secondary" className="mx-2 p-1">
                          <Image rounded src="/images/user.png" style={{ width: '1em' }} />
                        </Badge>
                        <span className="text-light">
                          {`${session.user.name}`}
                        </span>
                      </Fragment>
                    )}
                  >
                    <NavDropdown.Item as={LogoutLink}>Sign Out</NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown className="d-lg-none" title={`${session.user.name}`}>
                    <NavDropdown.Item as={LogoutLink}>Sign Out</NavDropdown.Item>
                  </NavDropdown>
                </Fragment>
              ) : (
                <Nav.Link as={Link} to="/login" className="ml-lg-auto">
                  Login / Register
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Container fluid className="app-layout-content mvh-navbar-footer p-0">
          {this.props.children}
        </Container>

        <footer className="bg-dark text-light mt-5 mb-0 py-5">
          <Container>
            RBAC //TODO app
          </Container>
        </footer>

      </div>
    )
  }

})
