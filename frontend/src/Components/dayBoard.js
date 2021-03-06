import React, { useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import moment from 'moment';

import SpotCard from './spotCard';
import GoogleMap from './googleMap';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	dayBoard: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: 336,
		maxWidth: 336,
		marginRight: 30,
		[theme.breakpoints.down(430)]: {
			minWidth: '80%',
			marginRight: '5%',
		},
		// boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
	},
	date: {
		padding: '10px 15px',
		// backgroundColor: theme.palette.secondary,
		// color: 'white',
		fontSize: '1.2em',
		borderBottom: 'lightGrey solid 0.5px',
	},
	droppable: {
		padding: 8,
		flexGrow: 1,
		minHeight: 400,
		minWidth: 200,
		// if you put a overflow scroll here, you won't be able to scroll through the day boards with a draggable
	},
}));

function DayBoard(props) {
	const { boardId, date, spots, coordinates } = props;
	const classes = useStyles();

	let myref = useRef(null);
	const setRef = (dragRefFunction, ref) => {
		myref = ref;
		dragRefFunction(ref);
	};

	const executeScroll = (index) => {
		// const pixel = index * 310
		// console.dir(myref);
		// myref.scrollLeft = pixel;
		console.log('hi');
	};

	const placeHolderText = (
		<p>Drag cards from above into this space to plan your day 😊</p>
	);

	return (
		<Paper
			className={classes.dayBoard}
			variant="outlined"
			data-testid="day-board"
		>
			{/* <div className={classes.root} > */}
			<div className={classes.date}>
				<p>
					{date.format('DD MMM')} - {date.format('ddd')}
				</p>
			</div>
			<Droppable droppableId={boardId} direction="vertical">
				{(provided) => (
					<div
						className={classes.droppable}
						ref={(ref) => setRef(provided.innerRef, ref)}
						{...provided.droppableProps}
						data-testid={boardId}
					>
						{spots.length > 0
							? spots.map((spot, index) => (
									<SpotCard
										key={spot.id}
										spot={spot}
										index={index}
										date={date}
										day={date.day()}
										expanded={false}
										dragAndDroppable={true}
									/>
							  ))
							: placeHolderText}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<GoogleMap
				coordinates={coordinates}
				spots={spots}
				pinClicked={executeScroll}
			/>
			{/* </div> */}
		</Paper>
	);
}

export default DayBoard;
