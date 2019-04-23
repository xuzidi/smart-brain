import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';


const particleOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};


class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined: ''
            }
        };

    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        });
    };

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - clarifaiFace.bottom_row * height
        }
    };

    displyFaceBox = (box) => {
        this.setState({box: box});
    };

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    };

    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3000/imageUrl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        }).then((response) => response.json())
            .then(
                (response) => {
                    if (response) {
                        fetch('http://localhost:3000/image', {
                            method: 'put',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                id: this.state.user.id
                            })
                        }).then(response => response.json())
                            .then(count => {
                                this.setState(Object.assign(this.state.user, {entries: count}));
                            })
                    }
                    this.displyFaceBox(this.calculateFaceLocation(response))
                }).catch(err => console.log(err));


    };

    onRouteChange = (route) => {
        this.setState({route: route});
        if (route === 'home') {
            this.setState({isSignedIn: true});

        } else {
            this.setState({imageUrl: ''});
            this.setState({box: {}});
            this.setState({user: {}});
            this.setState({isSignedIn: false});
        }


    };

    render() {
        return (
            <div className="App">
                <Particles className='particles'
                           params={particleOptions}
                />

                <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
                {this.state.route === 'home' ?
                    <div>
                        < Logo/>
                        < Rank name={this.state.user.name} entries={this.state.user.entries}/>
                        < ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
                    </div>
                    :
                    (
                        this.state.route === 'register' ?
                            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                            :
                            < SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )


                }


            </div>
        );
    }
}

export default App;
