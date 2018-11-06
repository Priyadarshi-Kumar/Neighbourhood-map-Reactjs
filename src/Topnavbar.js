import React, { Component } from 'react'

class Topnavbar extends Component {

    /*
    * Handle input when place changes 
    */
    handlePlaceChange = (event) => {
        this.props.handlePlaceChange(event.target.value)
    }

    /*
    * Handle input when type of interest changes 
    */
    handleInterestChange = (event) => {
        this.props.handleInterestChange(event.target.value)
    }

    render() {
        return (
            <div>
                <div className='top-navbar'>
                    <div className='select' aria-label='place selector'>
                        <select tabIndex='0' aria-label='select place' onChange={this.handlePlaceChange} name='department' required className="select__field">
                            <option value='belgaum' default>Belgaum</option>
                            <option value='kolkata'>Kolkata</option>
                            <option value='chennai'>Chennai</option>
                            <option value='mumbai'>Mumbai</option>
                            <option value='delhi'>Delhi</option>
                            <option value='patna'>Patna</option>
                            <option value='Hyderabad'>Hyderabad</option>
                            <option value='chandigarh'>Chandigarh</option>
                            <option value='noida'>Noida</option>
                        </select>
                    </div>
                    <div className='select' aria-label='interest'>
                        <select aria-label='select what you interested in' tabIndex='0' onChange={this.handleInterestChange} name='department' required className="select__field">
                            <option value='restaurant' default>Restaurant</option>
                            <option value='school'>School</option>
                            <option value='college'>College</option>
                            <option value='hospital'>Hospital</option>
                            <option value='tourist place'>Tourist place</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}
export default Topnavbar