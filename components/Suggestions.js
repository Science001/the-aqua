import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    marginBottom: 20,
  },
});

export default function Suggestions(props) {
  const classes = useStyles();
  return (
    <div className="wrapper">
      <Typography variant="h5" gutterBottom>{"Suggested Solutions"}</Typography>
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={"Ventilation"}
            height="250"
            image={`/static/images/window.jpg`}
            title={"Ventilation"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {"Ventilation"}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {"If possible, improve air circulation within the room. Letting in fresh air can reduce the concentrations of VOCs in the indoor significantly."}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {props.plant &&
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={props.plant.name}
              height="250"
              image={`/static/images/${props.plant.image}`}
              title={props.plant.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {props.plant.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {"Based on your current pollution levels and the patient's symptoms, we would recommend you to place this plant anywhere within the premises, in order to nullify the critical VOC concentrations."}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button variant="contained" size="small" color="primary" onClick={() => window.open("https://www.google.com/maps/search/nearby+nurseries")}>
              {"Nearby Nurseries"}
            </Button>
            <Button variant="contained" size="small" color="primary" onClick={() => window.open(`https://www.google.com/search?q=${props.plant.name.split(' ').join('+')}&tbm=shop`)}>
              {"Buy Online"}
            </Button>
          </CardActions>
        </Card>
      }
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={"Air Purifier"}
            height="250"
            image={`/static/images/purifier.jpg`}
            title={"Air Purifier"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {"Air Purifier"}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {"Get an air purifier system. Air purifiers can improve air quality by filtering out harmful VOCs from the indoor air. Click to check out the market place."}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
            <Button variant="contained" size="small" color="primary" onClick={() => window.open(`https://www.google.com/search?q=air+purifier&tbm=shop&tbs=ppr_max=2500`)}>
              {"Buy Online"}
            </Button>
          </CardActions>
      </Card>
      <style jsx>{`
      .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .card {
        width: 40%;
        marginBottom: 30px;
      }
      @media screen and (max-width: 900px) {
        .card {
            width: 90%;
        }
      }
      `}</style>
    </div>
  )
}