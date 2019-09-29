import React from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import axios from 'axios'
import { attach } from 'actions-on-google/dist/assistant'

class Questionnaire extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            headache: Math.floor((Math.random() * (25-3))+3),
            nausea: Math.floor((Math.random() * (25-3))+3),
            dizziness: Math.floor((Math.random() * (25-3))+3),
            tightnessInChest: Math.floor((Math.random() * (25-3))+3),
            noseIrritation: Math.floor((Math.random() * (50-3))+3),
            throatIrritation: Math.floor((Math.random() * (50-3))+3),
            shortnessOfBreath: Math.floor((Math.random() * (25-3))+3),
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        })
    }

    render() {
        return (
            <form className="login-box">
                <Typography variant="h4" style={{marginBottom: 10}}>Find a Solution</Typography>
                <Typography variant="caption">Enter the number of patients who felt any of these symptoms today</Typography>
                <TextField
                    label="Headache"
                    value={this.state.headache}
                    onChange={this.handleChange('headache')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Nausea"
                    value={this.state.nausea}
                    onChange={this.handleChange('nausea')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Dizziness"
                    value={this.state.dizziness}
                    onChange={this.handleChange('dizziness')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Tightness in Chest"
                    value={this.state.tightnessInChest}
                    onChange={this.handleChange('tightnessInChest')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Nose Irritation"
                    value={this.state.noseIrritation}
                    onChange={this.handleChange('noseIrritation')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Throat Irritation"
                    value={this.state.throatIrritation}
                    onChange={this.handleChange('throatIrritation')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    label="Shortness of Breath"
                    value={this.state.shortnessOfBreath}
                    onChange={this.handleChange('shortnessOfBreath')}
                    margin="normal"
                    type="number"
                    fullWidth
                    variant="outlined"
                />

                <Button variant="contained" color="primary" fullWidth style={{margin: "10px 0 10px 0"}} onClick={() => this.props.getPlant(this.state)}>Get Suggestions</Button>

                <style jsx>{`
            .login-box{
                border-radius: 10px;
                box-shadow: 0 0 5px 0;
                width: 40%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px 10px;
                text-align: center;
            }
            @media screen and (max-width: 900px) {
                .login-box {
                    width: 90%;
                }
              }
            `}</style>
            </form>
        )
    }
}

export default Questionnaire