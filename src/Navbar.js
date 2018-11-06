import React, { Component } from 'react'
import escapeRegExp from 'escape-string-regexp'

class Navbar extends Component {

    /*
    * Brings up the side nevigation after clicking on search
    */
    openNav = () => {
        document.getElementById("mySidenav").style.width = "300px";
    }

    /*
    * Hides the side nevigation after clicking on search
    */
    closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
    }

    /**
    * open marker when a list item is clicked
    */    
    openMarker = (location) => {
        this.props.markers.map(marker => {
          if (marker.title === location) {
            window.google.maps.event.trigger(marker, "click")
          }
        })
      }

    render() {
        const allLocations = this.props.allLocations
        return (
            <div className='sidenavbar' aria-label='side navigation'>
                <div id="mySidenav" className="sidenav" role='application'>
                    <div className='searchBox'>
                        <input type='text' placeholder='Search from below list'
                            onChange={event => this.props.updateQuery(event.target.value)}
                            aria-label='search input' />
                    </div>
                    <ol aria-label='menu item'>
                        <li href="javascript:void(0)" className="closebtn" onClick={this.closeNav} aria-label='close'>&times;</li>
                        {this.props.allLocations.map((location, index) => (<li  key= {index} 
                        tabIndex='0' 
                        onClick={() => {
                            this.openMarker(location.venue.name);
                          }}
                        aria-label={location.venue.name}>{location.venue.name}</li>))}
                    </ol>
                </div>
                <span style={{ paddingTop: '3px', fontWeight: 'bold', marginLeft: '8px', borderRadius: '4px', paddingLeft: '4px', paddingRight: '4px', fontSize: '17px', cursor: 'pointer', color: 'white', display: 'block', backgroundColor: 'brown', height: '28px', border: '1px solid white' }} onClick={this.openNav}>&#9776; Search</span>
            </div>

        )
    }
}
export default Navbar