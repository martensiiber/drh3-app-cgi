import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';

class InterviewersSlider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { interviewersAmount, handleSliderChange, maxInterviewers } = this.props;

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
                            value={typeof interviewersAmount === 'number' ? interviewersAmount : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default InterviewersSlider;