import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';

class InterviewersSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sliderAmount: 0
        }
    }

    componentDidMount() {
        this.setState({ sliderAmount: this.props.maxInterviewers })
    }

    handleChange = (event, newValue) => {
        this.setState( {sliderAmount: newValue});
    };

    render() {
        const { handleSliderChange, maxInterviewers } = this.props;
        const { sliderAmount } = this.state;

        return (
            <div className="interviewers-slider">
                <Typography id="input-slider" gutterBottom className="interviewers-slider-label">
                    Choose amount of interviewers
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            valueLabelDisplay="on"
                            step={1}
                            max={maxInterviewers}
                            value={typeof sliderAmount === 'number' ? sliderAmount : 0}
                            onChange={this.handleChange}
                            onChangeCommitted={handleSliderChange}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default InterviewersSlider;