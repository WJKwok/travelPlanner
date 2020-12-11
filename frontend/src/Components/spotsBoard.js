import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import moment from 'moment';
import SpotCard from './spotCard';
import GoogleMap from './googleMap';
import DaySelectMenu from './daySelectMenu';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		alignItems: 'flex-start',
		overflowX: 'auto',
		alignItems: 'flex-start',
		// minHeight: 300,
		// boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
		padding: 10,
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	paddingRight: {
		padding: 5,
		backgroundColor: 'transparent',
	},
}));

function SpotsBoard(props) {
	const classes = useStyles();
	const { boardId, spots, coordinates } = props;
	const [mouseOverCard, setMouseOverCard] = useState(undefined);

	const [day, setDay] = useState(moment().startOf('date').day());

	let myref = useRef(null);
	const setRef = (dropRefFunction, ref) => {
		myref = ref;
		dropRefFunction(ref);
	};

	const executeScroll = (index, key) => {
		const pixel = index * 310 + 5;
		console.log('map marker:', key);
		setMouseOverCard(key);
		myref.scrollLeft = pixel;
	};

	const placeHolderText = (
		<p>Click on the category chips above 👆 to display cards.</p>
	);

	return (
		<Paper elevation={0} data-testid="spots-board">
			<DaySelectMenu day={day} dayChangeHandler={setDay} />
			<Droppable droppableId={boardId} direction="horizontal">
				{(provided) => (
					<div
						className={classes.root}
						ref={(ref) => setRef(provided.innerRef, ref)}
						{...provided.droppableProps}
					>
						{spots.length > 0
							? spots.map((spot, index) => (
									<SpotCard
										key={spot.id}
										spot={spot}
										day={day}
										index={index}
										expanded={true}
										highlight={mouseOverCard === spot.id}
										mouseOver={(id) => setMouseOverCard(id)}
									/>
							  ))
							: placeHolderText}
						<Paper className={classes.paddingRight} elevation={0} />
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<GoogleMap
				coordinates={coordinates}
				spots={spots}
				pinClicked={executeScroll}
				mouseOverCard={mouseOverCard}
			/>
		</Paper>
	);
}

export default SpotsBoard;
