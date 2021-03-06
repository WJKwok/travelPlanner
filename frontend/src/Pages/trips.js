import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

import { AuthContext } from '../Store/AuthContext';
import { SpotContext } from '../Store/SpotContext';
import { SnackBarContext } from '../Store/SnackBarContext';

import AppBar from '../Components/appBar';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 0,
		[theme.breakpoints.down(430)]: {
			padding: '0px 16px',
		},
	},
	greeting: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingBottom: 20,
	},
	tripCard: {
		marginBottom: 15,
		display: 'flex',
	},
	headerThumbnail: {
		width: 100,
	},
	headerTitle: {
		flex: '1 0 auto',
	},
	nextButton: {
		marginLeft: 'auto',
		'&:hover': {
			backgroundColor: 'transparent',
			color: 'red',
		},
	},
}));

function Trips() {
	const { authState, dispatch: authDispatch } = useContext(AuthContext);
	const { dispatch: placeDispatch } = useContext(SpotContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const classes = useStyles();

	const { loading, data: { getUserTrips: trips } = {} } = useQuery(
		GET_USER_TRIPS,
		{
			variables: {
				userId: authState.user.id,
			},
		}
	);

	const greetingName = authState.user.username.split(' ')[0];
	const handleLogout = () => {
		authDispatch({ type: 'LOGOUT' });
		placeDispatch({ type: 'CLEAR_STATE' });
		setSnackMessage({ text: 'Logout Success!', code: 'Confirm' });
	};

	const [deleteTrip] = useMutation(DELETE_TRIP, {
		update(proxy, result) {
			console.log('done:', result.data.deleteTrip);

			const data = proxy.readQuery({
				query: GET_USER_TRIPS,
				variables: {
					userId: authState.user.id,
				},
			});

			proxy.writeQuery({
				query: GET_USER_TRIPS,
				variables: {
					userId: authState.user.id,
				},
				data: {
					getUserTrips: data.getUserTrips.filter(
						(i) => i.id !== result.data.deleteTrip
					),
				},
			});
		},
		onError(err) {
			console.log(err);
		},
	});

	const deleteHandler = (tripId) => {
		console.log('is there a trip id?', tripId);
		deleteTrip({ variables: { tripId } });
	};

	console.log(trips);
	const tripCards = loading
		? ''
		: trips.map((trip) => {
				return (
					<Card
						className={classes.tripCard}
						key={trip.id}
						data-testid={`tripCard-${trip.id}`}
					>
						<CardMedia
							className={classes.headerThumbnail}
							image={trip.guide.coverImage}
						/>
						<Link to={`/planner/${trip.guide.id}/${trip.id}`}>
							<CardContent className={classes.headerTitle}>
								<Typography variant="h5">{trip.guide.city}</Typography>
								<Typography data-testid="trip-date" variant="subtitle1">
									{moment(trip.startDate).format('DD MMM')} -{' '}
									{moment(trip.startDate)
										.add(trip.dayLists.length - 1, 'days')
										.format('DD MMM')}
								</Typography>
							</CardContent>
						</Link>
						<IconButton
							data-testid="delete-trip"
							className={classes.nextButton}
							disableRipple={true}
							disableFocusRipple={true}
							onClick={() => deleteHandler(trip.id)}
						>
							<HighlightOffIcon />
						</IconButton>
					</Card>
				);
		  });

	return (
		<div className={classes.root}>
			<AppBar offset={true} />
			<div className={classes.greeting}>
				<Typography variant="h4">
					Hi {greetingName.charAt(0).toUpperCase() + greetingName.slice(1)} 🙃
				</Typography>
				<Button
					variant="outlined"
					color="default"
					className={classes.button}
					onClick={handleLogout}
				>
					Logout 👋🏻
				</Button>
			</div>

			{tripCards}
			<Link to={'/'}>
				<IconButton
					disableRipple={true}
					disableFocusRipple={true}
					onClick={() => placeDispatch({ type: 'CLEAR_STATE' })}
				>
					<AddCircleOutlineRoundedIcon fontSize="large" />
				</IconButton>
			</Link>
		</div>
	);
}

const GET_USER_TRIPS = gql`
	query getUserTrips($userId: ID!) {
		getUserTrips(userId: $userId) {
			id
			guide {
				id
				coverImage
				city
			}
			dayLists
			startDate
		}
	}
`;

const DELETE_TRIP = gql`
	mutation deleteTrip($tripId: ID!) {
		deleteTrip(tripId: $tripId)
	}
`;

export default Trips;
