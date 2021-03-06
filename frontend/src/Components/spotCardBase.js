import React, { useState, useContext } from 'react';
import { SpotContext } from '../Store/SpotContext';
import { LoggerContext } from '../Store/LoggerContext';
import moment from 'moment';

import { iconDict } from './spotIcons';
import { makeStyles } from '@material-ui/core/styles';
import {
	Card,
	CardMedia,
	CardContent,
	Collapse,
	Typography,
	IconButton,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Rating from '@material-ui/lab/Rating';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import { Draggable } from 'react-beautiful-dnd';
import { Image } from 'cloudinary-react';

import marked from 'marked';
import { SpotCardImages, HeaderThumbnail } from './loggingImage';
import GoogleDirectionLink from './googleDirectionLink';

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: theme.cardWidth,
		maxWidth: theme.cardWidth,
		margin: 5,
		[theme.breakpoints.down(theme.maxMobileWidth)]: {
			minWidth: '75%',
		},
	},
	header: {
		display: 'flex',
	},
	headerInfo: {
		overflowX: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	iconsRow: {
		display: 'flex',
		alignItems: 'center',
	},
	editButton: {
		cursor: 'pointer',
	},
	catIndex: {
		// backgroundColor: props.backgroundColor,
		border: 'solid 2px grey',
		display: 'flex',
		alignItems: 'center',
		marginRight: 5,
		borderRadius: 5,
		padding: '0px 3px',
	},
	emoji: {
		fontSize: 20,
		lineHeight: 1,
		paddingRight: 3,
	},
	index: {
		fontWeight: 600,
		fontSize: 15,
	},
	spotTitle: {
		fontSize: '1.2em',
		lineHeight: 'normal',
		padding: '5px 0px',
		overflowX: 'auto',
		whiteSpace: 'nowrap',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	categoryOverflow: {
		overflowX: 'auto',
		whiteSpace: 'nowrap',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	spotSubtitle: {
		marginRight: 5,
		fontSize: '0.9em',
	},
	spotEventWrongDay: {
		display: 'inline-block',
		backgroundColor: 'red',
		color: 'white',
		fontSize: '0.9em',
		padding: '0px 3px',
		borderRadius: '3px',
	},
	headerThumbnail: {
		minWidth: 90,
		maxWidth: 90,
		objectFit: 'cover',
		// paddingBottom: '75%',
		// paddingTop: '56.25%', // 16:9
	},
	ratingDiv: {
		display: 'flex',
		alignItems: 'center',
	},
	collapseContent: {
		maxHeight: 200,
		overflowY: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	mediaCards: {
		display: 'flex',
		overflowX: 'auto',
		overflowX: 'scroll',
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	content: {
		paddingBottom: '2em',
	},
}));

//to get link in marked.js to open in a new tab
const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
	const html = linkRenderer.call(renderer, href, title, text);
	return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

export const SpotCardBase = (props) => {
	const {
		spot,
		index,
		date,
		day,
		highlight,
		mouseOver,
		dragAndDroppable,
		provided,
	} = props;
	const { dispatch } = useContext(SpotContext);
	const { setClickedCard } = useContext(LoggerContext);
	// const cssProps = {
	// 	backgroundColor: iconColour[spot.categories[0]]
	// 		? iconColour[spot.categories[0]]
	// 		: iconColour.Default,
	// };
	// const classes = useStyles(cssProps);
	const classes = useStyles();
	const [expanded, setExpanded] = useState(props.expanded);
	const [liked, setLiked] = useState(spot.liked);

	const handleExpandClick = () => {
		setExpanded((expanded) => !expanded);
	};

	const editClickHandler = (e) => {
		e.stopPropagation();
		console.log('use ratings on clicked from spotcardbase:', spot);
		setClickedCard(spot);
	};

	const likeClickHandler = (e) => {
		e.stopPropagation();
		setLiked(!liked);
		dispatch({ type: 'LIKE_TOGGLE', payload: { spotId: spot.id } });
	};

	const trimDayText = (dayText) => {
		const dayAndHoursArray = dayText.split('day');
		const trimmedDayText =
			dayAndHoursArray[0].slice(0, 3) + dayAndHoursArray[1];
		return trimmedDayText;
	};

	const isEventOnRightDayBoard = (date, spot) => {
		// no date prop if in spotsBoard
		if (!date) {
			return true;
		}

		// if not an event card
		if (spot.categories[0] !== 'Event') {
			return true;
		}

		if (
			spot.categories[0] === 'Event' &&
			moment(date).isSame(spot.date, 'day')
		) {
			return true;
		}

		if (
			spot.categories[0] === 'Event' &&
			!moment(date).isSame(spot.date, 'day')
		) {
			return false;
		}
	};

	const dayToArrayIndex = day === 0 ? 6 : day - 1;

	const businessStatus =
		spot.place.businessStatus === 'OPERATIONAL' && spot.place.hours
			? trimDayText(spot.place.hours[dayToArrayIndex])
			: spot.place.businessStatus;

	const eventIsOnRightDayBoard = isEventOnRightDayBoard(date, spot);
	const cardHeader =
		spot.categories[0] === 'Event' ? (
			<>
				<Typography className={classes.spotTitle}>{spot.eventName}</Typography>
				<Typography
					data-testid="event-card-date"
					className={
						eventIsOnRightDayBoard
							? classes.spotSubtitle
							: classes.spotEventWrongDay
					}
				>
					{moment(spot.date).format('Do MMM YYYY')}
				</Typography>
				<Typography className={classes.spotSubtitle}>
					{spot.place.name}
				</Typography>
				<Typography className={classes.categoryOverflow}>
					{spot.categories.join(', ')}
				</Typography>
			</>
		) : (
			<>
				<Typography className={classes.spotTitle}>{spot.place.name}</Typography>

				<Typography
					data-testid="business-status"
					className={classes.categoryOverflow}
				>
					{businessStatus}
				</Typography>
				<div className={classes.ratingDiv}>
					<Typography className={classes.spotSubtitle}>
						{spot.place.rating}
					</Typography>
					<Rating
						value={spot.place.rating}
						precision={0.5}
						size="small"
						readOnly
					/>
					<Typography className={classes.spotSubtitle}>
						({spot.place.userRatingsTotal})
					</Typography>
				</div>
				<Typography className={classes.categoryOverflow}>
					{spot.categories.join(', ')}
				</Typography>
			</>
		);

	return (
		<Card
			id="spot-card"
			ref={provided && provided.innerRef}
			{...(provided ? { ...provided.draggableProps } : {})}
			{...(provided ? { ...provided.dragHandleProps } : {})}
			// {...provided.draggableProps}
			// {...provided.dragHandleProps}
			className={classes.root}
			data-testid={spot.id}
			elevation={highlight ? 24 : 1}
			onMouseEnter={mouseOver ? () => mouseOver(spot.id) : null}
			onMouseLeave={mouseOver ? () => mouseOver(null) : null}
		>
			<div
				className={classes.header}
				onClick={handleExpandClick}
				data-testid="spot-card"
			>
				{expanded ? (
					''
				) : (
					<CardMedia className={classes.headerThumbnail}>
						<HeaderThumbnail spotImgUrl={spot.imgUrl[0]} />
					</CardMedia>
				)}

				<CardContent className={classes.headerInfo}>
					<div className={classes.iconsRow}>
						<div className={classes.catIndex}>
							<span className={classes.emoji}>
								{iconDict[spot.categories[0]]
									? iconDict[spot.categories[0]]
									: iconDict.Default}
							</span>
							<span className={classes.index}>{index + 1}</span>
						</div>
						{dragAndDroppable ? (
							<div onClick={likeClickHandler}>
								{liked ? (
									<FavoriteIcon color="error" data-testid="filled-heart" />
								) : (
									<FavoriteBorderIcon data-testid="hollow-heart" />
								)}
							</div>
						) : (
							<div className={classes.editButton} onClick={editClickHandler}>
								<EditOutlinedIcon data-testid="edit-pen" />
							</div>
						)}
					</div>
					{cardHeader}
				</CardContent>
			</div>
			<Collapse
				data-testid={`collapseContent-${spot.id}`}
				className={classes.collapseContent}
				in={expanded}
				timeout="auto"
				unmountOnExit
			>
				<div className={classes.mediaCards}>
					<SpotCardImages spotImgUrl={spot.imgUrl} />
				</div>
				<CardContent>
					<div
						className={classes.content}
						dangerouslySetInnerHTML={{
							__html: marked(spot.content, { renderer }),
						}}
					/>
					{spot.place.website && (
						<a target="_blank" href={spot.place.website}>
							Website
						</a>
					)}
					<Typography variant="body2">
						{spot.place.internationalPhoneNumber}
					</Typography>
					<Typography variant="body2">{spot.place.address}</Typography>
				</CardContent>
			</Collapse>
			{/* <GoogleDirectionLink place={spot.place}/> */}
		</Card>
	);
};
