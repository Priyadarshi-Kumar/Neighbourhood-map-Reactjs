import React, { Component } from 'react'
import axios from 'axios'
import escapeRegExp from 'escape-string-regexp'
import './App.css';
import Navbar from './Navbar'
import Topnavbar from './Topnavbar'

class App extends Component {

  state = {
    locations: [],
    typeQuery: 'restaurant',
    near: 'belgaum',
    query: '',
    markers: [],
    showLocations: [],
    invisibleMarkers: []
  }

  // Handle change in location name
  handlePlaceChange = (near) => {
    this.setState({ near }, () => {
      this.getLocations()
    })
  }

  // Handle change when choice of interest changes
  handleInterestChange = (query) => {
    this.setState({ typeQuery: query }, () => {
      this.getLocations()
    })
  }

  componentDidMount() {
    this.getLocations()
  }

  /**
   * loadMap function loads the map script and initializes the map
   */
  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCP_IFavLsnfIXEIFS9gRb6E4ynZdDPnjI&callback=initMap")
    window.initMap = this.initMap
  }

  /**
   * Parameters for foursquare api.
   */
  getLocations = () => {
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?'
    const parameters = {
      client_id: '4ODF5DKPTEYCZCU2OGP02RTAJ03PBFK0ILV5S1VO14WOALTH',
      client_secret: '0QLWIQ1MIFJ5VUV5GWWBAVX21ISLCFS3SMXSXWOYEQAS5MUL',
      query: this.state.typeQuery,
      near: this.state.near,
      v: '20180411'
    }

    /**
     * This is like FETCH API - axios does the same thing
     * Reference: https://github.com/axios/axios
     */
    axios.get(endPoint + new URLSearchParams(parameters)).then(response => {
      this.setState({
        locations: response.data.response.groups[0].items,
        showLocations: response.data.response.groups[0].items
      }, this.loadMap())
      console.log(this.state.locations)
    })
      .catch(error => {
        alert(`Sorry, fetching data from Foursquare was not possible!`)
        console.log("Foursquare error! " + error)
      })
  }

  /**
   * Initializes map and uses the first objects of locations object array
   */
  initMap = () => {
    let lattitude
    let longitude
    if (this.state.locations[0]) {
      lattitude = this.state.locations[0].venue.location.lat
      longitude = this.state.locations[0].venue.location.lng
    }
    else {
      lattitude = 15.8581696
      longitude = 74.5255651
    }

    // Creates a new infowindow
    const infowindow = new window.google.maps.InfoWindow()

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: lattitude, lng: longitude },
      zoom: 13
    })

    /**
     * Content of an infoWindow
     */
    this.state.locations.map(location => {
      let contentString = `${location.venue.name} <br /> 
      ${location.venue.location.formattedAddress[0]}<br /> 
      ${location.venue.location.formattedAddress[1]}<br/> 
      ${location.venue.location.state}<br/> 
      ${location.venue.location.country}`

      /**
       * Create a marker
       */
      const marker = new window.google.maps.Marker({
        position: { lat: location.venue.location.lat, lng: location.venue.location.lng },
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: location.venue.name
      })

      this.state.markers.push(marker)

      function animationEffect() {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function () { marker.setAnimation(null) }, 550)
      }


      function openMarker() {
        // Sets content of infoWindow
        infowindow.setContent(contentString)
        animationEffect()
        // Open an infoWindow
        infowindow.open(map, marker)
      }

      // listens to the click on marker
      marker.addListener('click', function () {
        openMarker()
      })
    })

  }

  /**
   * Updatequery method handles the change in when a user wants
   * to filter from the available list of location as per user choice
   */
  updateQuery = (query) => {
    this.setState({ query })
    this.state.markers.map(marker => marker.setVisible(true))
    let filterLocations
    let invisibleMarkers

    if (query) {
      const match = new RegExp(escapeRegExp(query), "i")
      filterLocations = this.state.locations.filter(myLocation =>
        match.test(myLocation.venue.name)
      )
      this.setState({ locations: filterLocations })
      invisibleMarkers = this.state.markers.filter(marker =>
        filterLocations.every(location => location.venue.name !== marker.title)
      )

      /**
       * Hides the not required markers
       */
      invisibleMarkers.forEach(marker => marker.setVisible(false))
      this.setState({ invisibleMarkers })
    }
    else {
      this.setState({ locations: this.state.showLocations })
      this.state.markers.forEach(marker => marker.setVisible(true))
    }
  }



  render() {
    if (this.state.hasError) {
      return <div id="Error-message" aria-label="Error message">Sorry, something went wrong!</div>
    }
    else {
      return (
        <div className="App" role='main'>
          <Topnavbar
            handlePlaceChange={this.handlePlaceChange}
            handleInterestChange={this.handleInterestChange}/>

          <Navbar allLocations={this.state.locations}
            updateQuery={b => this.updateQuery(b)} 
            markers={ this.state.markers } />

          <div id="map" tabIndex='-1' aria-label="Map" role="application" ></div>
        </div>
      )
    }
  }
}

/*
* Function loadScript gets the url.
* let index => Gives the first selected script tag.
* With the let "script" we create our next script tag.
* index.parentNode.insertBefore(script, index) : Instead of appendChild.
* [script: newNode
* index: referenceNode]
* With "index" we select the first script tag, with "parentNode" 
* we select the parent node, with "insertBefore" we put our script
* at the very beginning, to the top of the lists.
*/
function loadScript(url) {
  let index = window.document.getElementsByTagName('script')[0]
  let script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
  script.onerror = function () {
    alert("Error loading map! Check the URL!");
  };
}

export default App;
